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
    <div id="canvasContainer" ref="canvasContainer" :class="{'cav': leftop, 'avc': !leftop}" @scroll="handleScroll">
      <canvas ref="pdfCanvas"></canvas>
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
  </div>
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
      leftop: false,
      textFontSize: 18, // 初始文本字体大小
      scale: 0.4, // 初始缩放比例
      selecting: false,
      pdfDocument:null,
      selectionStart: { x: 0, y: 0 },
      selectionEnd: { x: 0, y: 0 },
      selectedArea: null,
      dialogTableVisible: false,
      type:'',
      screenshot: null, // 用来保存截图的 Base64 数据
      ruleForm:{
        abstract: '',
        date:'',
        summary:'',
        prompt:''
      },
       hoveredRowIndex: null,
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
        console.log(viewport.width, viewport.height,'wh',wh,wh.offsetWidth,wh.offsetHeight);
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
    boxSelect() {
      // 检查是否存在 class 为 selection-boxd 的元素
        let selection = document.getElementsByClassName('selection-boxd');

        if (selection.length > 0) {
            // 将 HTMLCollection 转换为数组
            selection = Array.from(selection);

            // 遍历数组并移除每个元素
            selection.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
        }
      this.findAndMaskText(this.pdfDocument, this.$refs.pdfCanvas, window.getSelection().toString());
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
      console.log(array,'数组');
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
      // 遍历文本数组，找到目标文本
    },
    copy(){

    },
    handleMouseUp(event) {
      this.boxSelect()
      // this.extractTextFromSelection();
    },
    addchild(){
      console.log(this.ruleForm,'ruleform');
    },
    extractTextFromSelection() {
      if (!this.selectedArea) return;

      const { x, y, width, height } = this.selectedArea;
      const canvasContainer = this.$refs.canvasContainer;

      // Convert coordinates to PDF viewport coordinates
      const viewport = this.$refs.pdfCanvas.getBoundingClientRect();
      const pdfViewport = this.pdfDocument.getPage(1).then(page => page.getViewport({ scale: this.scale }));

      Promise.all([pdfViewport]).then(([pdfViewport]) => {
        const pdfX = x * (pdfViewport.width / viewport.width);
        const pdfY = y * (pdfViewport.height / viewport.height);
        const pdfWidth = width * (pdfViewport.width / viewport.width);
        const pdfHeight = height * (pdfViewport.height / viewport.height);

        return this.pdfDocument.getPage(1).then(page => {
          return page.getTextContent().then(textContent => {
            const textItems = textContent.items;
            const selectedTextItem = [];
            for(let i=0;i<this.jsonObj.paragraph.length;i++){
              var filteredItems = this.jsonObj.paragraph[i].char_location.filter(item => {
                const itemX = (item.x*this.scale) * (pdfViewport.width / viewport.width);
                const itemY = (item.y*this.scale) * (pdfViewport.height / viewport.height);
                return (
                  itemX >= pdfX &&
                  itemX <= pdfX + pdfWidth &&
                  itemY >= pdfY &&
                  itemY <= pdfY + pdfHeight
                );})
                selectedTextItem.push(...filteredItems);
            }
            const selectedText = selectedTextItem.map(item => item.word).join('');
            console.log(selectedText,'提取出来的文本');
            // this.ruleForm.abstract = selectedText; // Example: Update abstract field
            this.selectedArea = null;
          });
        });
      }).catch(error => {
        console.error('Error extracting text:', error);
      });
    },

  }
};
</script>

<style>
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
</style>