<template>
  <div class="contents">
    <div class="controls">
      <span @click="zoomIn"> <img src="./../assets/svg/zoomin.svg" alt="放大"></span>
      <span @click="zoomOut"> <img src="./../assets/svg/zoomout.svg" alt="缩小"></span>
      <span @click="selfAdaption"> <img src="./../assets/svg/selfAdaption.svg" alt="自适应"></span>
      <span @click="boxSelect"> <img src="./../assets/svg/boxSelect.svg" alt="框选"></span>
      <span @click="takeScreenshot" > <img src="./../assets/svg/screenshot.svg" alt="截图"></span>
      <span @click="extractTextFromSelection" v-if="selectedArea">提取文本</span>
    </div>
    <div class="box1" id="box1" @scroll="scroller">
      <div class="infinite-list-item" 
        v-for="(item,index) in count"
        :key="index" 
        id="demotest12">
        <div id="canvasContainer" ref="canvasContainer" :class="{'cav': leftop, 'avc': !leftop}" @scroll="handleScroll">
          <canvas ref="pdfCanvas" :id="item.cancasId"></canvas>
          <div id="text-overlay">
            <div v-for="paragraph in jsonObj.paragraph" :key="paragraph.word">
              <span v-for="char in paragraph.char_location"  
              @mouseup="handleMouseUp"
                    :style="{ 
                      position: 'absolute',
                      left: (char.x * scale) + 'px',
                      top: (char.y * scale) + 'px',
                      fontSize: (char.h * scale)-1 + 'px',
                      fontFamily:'宋体',
                      color: 'transparent' 
                    }">
                {{ char.word }}
              </span>
            </div>
          </div>
          <div class="insert" v-if="insert" :style="{left: (insert.x * scale) + 'px', top: (insert.y * scale) + 'px'}">
            <div class="transcript" @click="transcript"><img src="./../assets/icons/transcript.png" alt=""> 插入笔录</div>
            <span class="verticalLine"></span>
            <div class="bookmark" @click="bookmark"><img src="./../assets/icons/bookmark.png" alt="">插入书签</div>
          </div>
          <div class="bookmark-list" v-for="(item,index) in bookmarkList" :key="index" :style="{left: (item.x * scale) + 'px', top: (item.y * scale) + 'px'}">
            <img src="./../assets/icons/bookmark.png" alt="">
          </div>
      
        </div>
      </div>
    </div>
  <el-dialog :close-on-click-modal=false title="截图" :visible.sync="dialogTableVisible">
      <div class="title">图片预览:</div>
      <div class="screenshot-container">
          <img :src="screenshot" alt="Screenshot" />
      </div>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="摘要:" prop="abstract">
          <el-input placeholder="暂未提取到相关摘要" disabled v-model="ruleForm.abstract"></el-input>
        </el-form-item>
        <el-form-item label="时间:" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="证件小结:" prop="summary">
          <el-input
            type="textarea"
            rows="3"
            placeholder="请输入"
            v-model="ruleForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="风险提示:" prop="prompt">
          <el-input
            type="textarea"
            rows="3"
            placeholder="请输入"
            v-model="ruleForm.prompt"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="copy">复制到剪贴板</el-button>
        <el-button type="primary" @click="addchild = false">在笔录末尾插入</el-button>
      </span>
    </el-dialog>
  <div
      v-if="selecting"
      class="selection-overlay"
      @mousedown="startSelection"
      @mousemove="resizeSelection"
      @mouseup="endSelection"></div>
    <div v-if="selectedArea " class="selection-box" :style="selectionBoxStyle"></div>
    </div>
</template>

<script>
import * as PDFJS from 'pdfjs-dist';
import html2canvas from 'html2canvas';

PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';

export default {
  name: "PdfViewer",
  props: {
    base64pdf: {
      type: String,
      required: true,
    },
    openleft: {
      type: Boolean,
      default: false
    },
    jsonObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      index:0,
      dataArr:[],
      suoyin:0,
      yeArr:[],
      PdfHeight:1200,
      leftop: false,
      textFontSize: 18, // 初始文本字体大小
      scale: 0.4, // 初始缩放比例
      selecting: false,
      insert:null,
   
      pdfDocument:null,
      selectionStart: { x: 0, y: 0 },
      selectionEnd: { x: 0, y: 0 },
      selectedArea: null,
      dialogTableVisible: false,
      type:'',
      bookmarkList:[],//书签列表
      count:[],
      screenshot: null, // 用来保存截图的 Base64 数据
      ruleForm:{
        abstract: '',
        date:'',
        summary:'',
        prompt:''
      },
      bookmarkx:'',
      bookmarky:'',
    };
  },
  watch: {
    openleft(val) {
      this.leftop = !val;
    },
    jsonObj(val){
      this.renderPDF(this.base64pdf);
    }
  },
  mounted() {
    this.renderPDF(this.base64pdf);
  },
  computed: {
    selectionBoxStyle() {
      const { x: startX, y: startY } = this.selectionStart;
      const { x: endX, y: endY } = this.selectionEnd;
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      const left = Math.min(startX, endX);
      const top = Math.min(startY, endY);
      return {
        left: `${left}px`,
        top: `${top+45}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '2px dashed #007bff',
        background: 'rgba(0, 123, 255, 0.2)',
        position: 'absolute'
      };
    }
  },
  methods: {
    async renderPDF(base64pdf) {
      try {
        const pdfData = base64pdf.split(",")[1]; // 移除前缀
        const decodedPdfData = atob(pdfData);
        const loadingTask = PDFJS.getDocument({ data: decodedPdfData });
        const pdf = await loadingTask.promise;
        this.pdfDocument = pdf;
        const pageNumber = 1; // Assuming you want to render the first page
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: this.scale });
        let wh = document.getElementById('canvasContainer')
        const canvas = this.$refs.pdfCanvas;
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        this.renderTextOverlay();
      } catch (error) {
        console.error("Failed to decode base64 PDF data:", error);
      }
    },
    renderTextOverlay() {
      const container = this.$refs.canvasContainer;
      const overlay = container.querySelector('#text-overlay');
      overlay.style.width = container.offsetWidth + 'px';
      overlay.style.height = container.offsetHeight + 'px';
    },
    //放大
    zoomIn() {
      this.scale += 0.1; // 增加缩放比例
      this.renderPDF(this.base64pdf); // 重新渲染PDF
    },
    //缩小
    zoomOut() {
      if (this.scale > 0.2) {
        this.scale -= 0.1; // 减小缩放比例，最小为0.2
        this.renderPDF(this.base64pdf); // 重新渲染PDF
      }
    },
    handleScroll() {
      const container = this.$refs.canvasContainer;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        this.$emit('reachedBottom');
      }
    },
    // 自适应
    selfAdaption(){
      this.scale = 1; // 重置缩放比例
      this.renderPDF(this.base64pdf); // 重新渲染PDF
    },
    startSelectingArea() {
      this.selecting = true;
      this.selectedArea = null;
    },
    startSelection(event) {
      this.selectedArea = true;
      this.selecting = true;
      const container = document.getElementById('canvasContainer');

      const containerRect = container.getBoundingClientRect();
      this.selectionStart = {
        x: event.clientX - containerRect.left ,
        y: event.clientY - containerRect.top 
      };
      this.selectionEnd = {
        x: event.clientX - containerRect.left ,
        y: event.clientY - containerRect.top
      };
    },
    resizeSelection(event) {
      this.selecting = true;
      if (this.selecting) {
        const container = this.$refs.canvasContainer;
        const containerRect = container.getBoundingClientRect();
        this.selectionEnd = {
          x: event.clientX - containerRect.left ,
          y: event.clientY - containerRect.top 
        };
      }
      event.preventDefault();
    },
    endSelection() {
      this.selecting = false;
      this.selectedArea = {
        x: Math.min(this.selectionStart.x, this.selectionEnd.x),
        y: Math.min(this.selectionStart.y, this.selectionEnd.y),
        width: Math.abs(this.selectionEnd.x - this.selectionStart.x),
        height: Math.abs(this.selectionEnd.y - this.selectionStart.y)
      };
      if(this.type=='takeScreenshot'){
        if (!this.selectedArea) return;
      const { x, y, width, height } = this.selectedArea;
      const screenshotArea = this.$refs.canvasContainer;
      html2canvas(screenshotArea, {
        x,
        y,
        width,
        height
      }).then(canvas => {
        const image = canvas.toDataURL('image/png');
        this.selectedArea = null; // 清空选区
        this.dialogTableVisible = true; // 打开截图对话框
        this.screenshot = image; // 保存截图到 screenshot 变量
      });
      }
    
    },
    takeScreenshot() {
      this.selecting = true;
      this.selectedArea = null;
      this.type='takeScreenshot';
    },
    async boxSelect() {
      // 检查是否存在 class 为 selection-boxd 的元素
      await this.clearSelection();
      await this.findAndMaskText(this.pdfDocument, this.$refs.pdfCanvas, window.getSelection().toString());
      this.type='boxSelect';
    },
    async findAndMaskText(pdf, canvas, searchText) {
      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      // 选中文本数组
      let targetArray = searchText.split('');
      const textItems = textContent.items;
      let foundObject = this.jsonObj.paragraph.find(item => item.word.includes(searchText));
      let result = [];
      let array = foundObject.char_location
      // 遍历数组进行匹配
          // 提取 transform 数组的第 4 和第 5 个元素
      let bookmarkx = [];
      let bookmarky = [];
      let bookmarkw = [];
      foundObject.char_location.forEach(item => {
        bookmarkx.push(item.x);
        bookmarky.push(item.y);
        bookmarkw.push(item.w);
      });
      this.bookmarkx = Math.max(...bookmarkx)+Math.max(...bookmarkw)+5;
      this.bookmarky = (Math.max(...bookmarky)+Math.min(...bookmarky))/2;
      
      for (let i = 0; i <= array.length - targetArray.length; i++) {
          // 判断数组中从当前位置开始的连续字符是否与目标字符串匹配
          let match = true;
          for (let j = 0; j < targetArray.length; j++) {
              if (array[i + j].word !== targetArray[j]) {
                  match = false;
                  break;
              }
          }
          if (match) {
              // 如果匹配成功，则将连续对象加入结果数组
              result = array.slice(i, i + targetArray.length);
              break;
          }
      }
      let transform4 = [];
      let transform5 = [];
      let transform2 = [];
      let transform3 = [];
      // 提取 transform 数组的第 4 和第 5 个元素
      result.forEach(item => {
          transform4.push(item.x);
          transform5.push(item.y);
          transform2.push(item.h);
          transform3.push(item.w);
      });
      
      // 计算出选区的坐标
      let left = Math.min(...transform4);
      let width = Math.max(...transform4)-Math.min(...transform4)+Math.max(...transform3);
      let top = Math.min(...transform5);
      let height = Math.max(...transform5)-Math.min(...transform5)+Math.max(...transform2);
      var container = document.getElementById('canvasContainer');
      var newDiv = document.createElement('div');
      newDiv.className='selection-boxd'
      newDiv.style.position = 'absolute';
      newDiv.style.left = left*this.scale + 'px';
      newDiv.style.top = top*this.scale + 'px';
      newDiv.style.width = width*this.scale + 'px';
      newDiv.style.height = height*this.scale + 'px';
      newDiv.style.border = '2px dashed #007bff';
      newDiv.style.background = 'rgba(0, 123, 255, 0.2)';
      newDiv.style.zIndex = 999;
      newDiv.style.pointerEvents = 'none';
      container.appendChild(newDiv);
      let insert = {
        x: left+width-150,
        y: (top+height),
      }
      this.insert = insert;
      // 遍历文本数组，找到目标文本
    },
    copy(){

    },
    // 清除选中框
    clearSelection() {
      let selection = document.getElementsByClassName('selection-boxd');

      if (selection.length > 0) {
          // 将 HTMLCollection 转换为数组
          selection = Array.from(selection);

          // 遍历数组并移除每个元素
          selection.forEach(function(element) {
              element.parentNode.removeChild(element);
          });
          this.insert = null;
      }
    },
    handleMouseUp(event) {
      this.boxSelect()
      // this.extractTextFromSelection();
    },
    addchild(){
      console.log(this.ruleForm,'ruleform');
    },
  
    transcript(){

    },
    bookmark(){
      this.bookmarkList.push({x:this.bookmarkx,y:this.bookmarky});
      // 去重
      let uniqueData = Array.from(new Set(this.bookmarkList.map(JSON.stringify)));
      this.insert = null;
      this.clearSelection();
    // 将字符串数组转换回对象数组
    this.bookmarkList =  uniqueData.map(JSON.parse);
      // this.bookmarkList = Array.from(new Set(this.bookmarkList));
      console.log(uniqueData,this.bookmarkList,'书签列表');
    },
    scroller(e) {
      let element = e.srcElement;
      this.index = Math.floor(
        (element.scrollTop + element.clientHeight) / (this.PdfHeight + 10)
      );
      // console.log('scroller')
      if (this.dataArr.length > this.count.length) {
        // 向下切换卷
        if (
          this.oldScroll < element.scrollTop &&
          this.index >= this.count.length - 2
        ) {
          if (this.suoyin < this.pageArr.length - 1) {
            this.suoyin++;
            // console.log('----  向下切换卷   ----')
            const l = [];
            l.length = this.pageArr[this.suoyin].length;
            this.count = [...this.count, ...l];
            this.yeArr = [...this.yeArr, ...this.pageArr[this.suoyin]];
          }
        }
        // 向上切换卷
        if (this.oldScroll >= element.scrollTop && this.index <= 2) {
          if (this.suoyin > 0) {
            this.suoyin--;
            // console.log('----  向上切换卷   ----')
            const l = [];
            l.length = this.pageArr[this.suoyin].length;
            this.count = [...l, ...this.count];
            this.yeArr = [...this.pageArr[this.suoyin], ...this.yeArr];
            this.index = l.length + this.index;
            this.$nextTick(() => {
              element.scrollTop = this.index * (this.PdfHeight + 10);
            });
          }
        }
      }
      this.oldScroll = element.scrollTop;
      this.pdfRender(this);
    },
  }
};
</script>

<style lang="less" scoped>
.contents {
  width: 100%;
  height:100%;
  display: flex;
  justify-content: flex-end;
}
#canvasContainer {
  position: relative;
  overflow: auto;
}
canvas {
  overflow: auto;
}
.avc {
  width: calc(100% - 200px) !important;
  height: 100%;
}
.cav {
  width: 100%;
  height: 100%;
}
#text-overlay {
  position: absolute;
  top: 0;
  left: 0;
}
.controls {
  width:180px; 
  position: absolute;
  top: 0;
  display: flex;
  height: 27px;
  right: 0;
  z-index: 999;
  justify-content: space-evenly;
  align-items: flex-end;
  .icon{
      width: 10px;
      font-size: 20px;
      height: 10px;
  }
}
.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
.selection-box {
  position: fixed;
  border: 2px dashed #007bff;
  z-index: 999;
  background: rgba(0, 123, 255, 0.2);
}
.screenshot-container{
  width: 300px;
  height: 200px;
  margin: 15px auto;
  img{
    height: 100%;
    width: 100%;
  }
}
.el-form-item {
  display: flex;
  flex-direction: column; 
}
.el-form-item__label{
  text-align: left;
}
.el-form-item__content{
  margin-left: 0 !important;
}
.el-dialog__body{
  padding: 23px 25px !important;
}
.el-textarea__inner {
    resize: none;
}
.el-button{
  border-radius: 6px;
  background: #F6F8FB;
  border: 1px solid #096DD9;
  color: #096DD9;
}
.el-button--primary{
  background-color: #096DD9;
  color: #fff;
}
#text-overlay div span::selection{
  background: #C5E2FA;
  color: #000;
}
.insert{
  position: absolute;
  top: 0;
  left: 0;
  width: 160px;
  height: 40px;
  background-color: #fff;
  z-index: 999;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #000;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.1);
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  img{
    width: 14px;
    height: 14px;
  }
  .transcript,.bookmark{
    display: flex;
    align-items: center;
    justify-content: center;

  }
  .verticalLine{
    height: 14px;
    border-right: 1px solid #E6E6E6;
  }
}
.bookmark-list{
  position: absolute;
}
</style>