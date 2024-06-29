<template>
  <div ref="fan">
    <div :id="PdfContent" ref="PdfContents"  style="height:100%;" :style="PDFSize">
      <canvas :id="idCanvas" ref="pdfCanvas"  :dataid="`data-id-${index}`" :style="PDFSize"/>
      <div id="text-overlay" :style="PDFSize">
        <div v-for="paragraph in jsonObj.paragraph" :key="paragraph.word">
          <span v-for="char in paragraph.char_location"
                @mouseup="handleMouseUp"
                :style="{ 
                  position: 'absolute',
                  left: (char.x * scsc) + 'px',
                  top: (char.y * scsc) + 'px',
                  fontSize: (char.h * scsc) - 1 + 'px',
                  fontFamily: '宋体',
                  color: 'transparent' 
                }">
            {{ char.word }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import PDFJS from "pdfjs-dist";
import { TextLayerBuilder } from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";
window.pdfjsWorker = require("pdfjs-dist/build/pdf.worker");

export default {
  name: "pdf",
  props: { PdfHeight: Number, url: String, PdfContent: String, idCanvas: String,index: Number, jsonObj: { type: Object, required: true },tjsonObj: { type: Object, required: true }},
  data() {
    return {
      value: "",
      link: "22",
      cutFlag: false,
      crap: false,
      previews: {},
      pdfUrl: this.url,
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1,
      page_num: 0,
      page_count: 0,
      bookmarkList:[],//书签列表
      maxscale: 1.25,
      minscale: 0.5,
      iswidth: null,
      isheight: null,
      viewportHeight: null,
      viewportWidth: null,
      mountedFlag: false,
      selecting: false,
      selectedArea: null,
      insert: null,
      bookmarkx:'',
      bookmarky:'',
      PDFSize: {},
      scsc: 0,
      
    };
  },
  created() {
    this.init(this.url);
  },
  mounted() {
    this.watchSize();
  },
  watch: {
    url(newvalue) {
      this.pdfUrl = newvalue;
      this.init(this.pdfUrl);
    },

  },
  computed: {
    ctx() {
      const id = document.getElementById(this.idCanvas);
      return id.getContext("2d");
    }
  },
  methods: {
    scaleUpdate(scale) {
      this.renderAllPages(1)
    },
    watchSize() {
      const _this = this;
      const erd = elementResizeDetectorMaker();
      erd.listenTo(this.$refs.fan, (element) => {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        _this.$nextTick(() => {
          this.iswidth = width;
          this.isheight = height;
        });
      });
    },
    // 放大
    zoomIn() {
      if (this.scale < this.maxscale) {
        this.scale += 0.25;
        this.renderAllPages(1);
      }
    },
    scaleUpdate(scale) {
      this.renderAllPages(1)
    },
    // 缩小
    zoomOut() {
      if (this.scale > this.minscale) {
        this.scale -= 0.25;
        this.renderAllPages(1);
      }
    },
    // 插入笔录
    transcript(){
      // this.insert = null;
      this.clearSelection();
      console.log(this.selectedArea,'val');
    },
    //添加书签
    bookmark(){
      let bookmarkDiv = document.createElement("div");
      bookmarkDiv.setAttribute("class", "bookmark");
      bookmarkDiv.style.position = "absolute";
      bookmarkDiv.style.width = "20px";
      bookmarkDiv.style.height = "20px";
      bookmarkDiv.setAttribute("id", "bookmark" + this.index);
      const transcriptImg = document.createElement('img');
        transcriptImg.src = require('./../assets/icons/bookmark.png');
        transcriptImg.alt = '';
      bookmarkDiv.appendChild(transcriptImg);
      bookmarkDiv.style.left = (this.bookmarkx *  this.scsc) + 'px';
      bookmarkDiv.style.top = (this.bookmarky *  this.scsc) + 'px';
      const id = document.getElementById(this.tjsonObj.pdfId);
      id.appendChild(bookmarkDiv);
      this.bookmarkList.push({x:this.bookmarkx,y:this.bookmarky});
      // 去重
      let uniqueData = Array.from(new Set(this.bookmarkList.map(JSON.stringify)));
      this.insert = null;
      this.clearSelection();
    // 将字符串数组转换回对象数组
    this.bookmarkList =  uniqueData.map(JSON.parse);
      // this.bookmarkList = Array.from(new Set(this.bookmarkList));
    },
    // 渲染全部pdf
    renderAllPages(num) {
        this.renderPage(num);
    },
    handleMouseUp() {},
    init(pdfUrl) {
      let _this = this;
      let base64 = pdfUrl;
      let decodedBase64 = atob(base64);
      PDFJS.getDocument({ data: decodedBase64 }).then((pdfDoc_) => {
        _this.pdfDoc = pdfDoc_;
        _this.page_count = _this.pdfDoc.numPages;
        _this.renderAllPages(1);
      });
    },
    //渲染pdf页面
    renderPage(num) {
      const vm = this;
      this.pageRendering = true;
      const canvas = document.getElementById(vm.idCanvas);
      this.pdfDoc.getPage(num).then((page) => {
        const viewport1 = page.getViewport({ scale: vm.scale });
        const viewport = page.getViewport({ scale:( vm.PdfHeight / viewport1.height)});
        vm.scsc =  (vm.PdfHeight) / viewport1.height;
        vm.PDFSize = {
          width: viewport.width + 'px',
          height: viewport.height + 'px'
        };
        vm.$emit('getPDFSize', vm.PDFSize);
        vm.viewportHeight = viewport.height;
        vm.viewportWidth = viewport.width;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        vm.$emit('func', canvas.height);
        const renderContext = {
          canvasContext: vm.ctx,
          viewport: viewport,
        };
        page.render(renderContext).then(() => {
          return page.getTextContent();
        }).then((textContent) => {
          this.renderTextOverlay();
          const textLayerDiv = document.createElement("div");
          textLayerDiv.setAttribute("class", "textLayer");
          textLayerDiv.setAttribute("id", "textLayer" + vm.index);
          textLayerDiv.setAttribute("data-html2canvas-ignore", "");
          textLayerDiv.style.width = vm.PDFSize.width;
          textLayerDiv.style.height = vm.PDFSize.height;
          const id = document.getElementById(vm.PdfContent);
          id.setAttribute("style", "position: relative");
          // 通过js给pdf页面添加一个div，作为文本层
          // if (id.querySelector('.textLayer')) {
          //   id.replaceChild(textLayerDiv, id.querySelector('.textLayer'));
          // } else {
          //   id.appendChild(textLayerDiv);
          // }
          // const textLayer = new TextLayerBuilder({
          //   textLayerDiv: textLayerDiv,
          //   pageIndex: page.pageIndex,
          //   viewport: viewport,
          // });
          // textLayer.setTextContent(textContent);
          // textLayer.render();
          // vm.pageRendering = false;
          if (vm.pageNumPending !== null) {
            vm.renderPage(vm.pageNumPending);
            vm.pageNumPending = null;
          }
          if (!vm.mountedFlag) {
            vm.$nextTick(() => {
              setTimeout(() => {
                vm.$emit('getImg');
                vm.mountedFlag = true;
              }, 100);
            });
          }
        });
      });
      vm.page_num = vm.pageNum;
    },
    renderTextOverlay() {
      const container = this.$refs.PdfContents;
      const overlay = container.querySelector('#text-overlay');
      overlay.style.width = container.offsetWidth + 'px';
      overlay.style.height = container.offsetHeight + 'px';
    },

    async boxSelect() {
      await this.clearSelection();
      await this.findAndMaskText( window.getSelection().toString());
      this.type='boxSelect';
    },
    async findAndMaskText( searchText) {
      // 选中文本数组
      this.selectedArea = searchText;
      let targetArray = searchText.split('');
      let foundObject = this.tjsonObj.jsonObj.paragraph.find(item => item.word.includes(searchText));
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
      var container =document.getElementById(this.tjsonObj.pdfId);
      var newDiv = document.createElement('div');
      newDiv.className='selection-boxd'
      newDiv.style.position = 'absolute';
      newDiv.style.left = left* this.scsc + 'px';
      newDiv.style.top = top* this.scsc + 'px';
      newDiv.style.width = width* this.scsc + 'px';
      newDiv.style.height = height* this.scsc + 4+'px';
      newDiv.style.border = '2px dashed #007bff';
      newDiv.style.background = 'rgba(0, 123, 255, 0.2)';
      newDiv.style.zIndex = 999;
      newDiv.style.pointerEvents = 'none';
      let insert = {
        x: left+width-150,
        y: (top+height),
      }
      const insertDiv = document.createElement('div');
            insertDiv.className = 'insert';
            insertDiv.style.position = 'absolute';
            insertDiv.style.left = insert.x* this.scsc + 'px';
            insertDiv.style.top = insert.y* this.scsc + 'px';
            insertDiv.style.width = '160px';
            insertDiv.style.height = '40px';
            insertDiv.style.background = '#fff';
            insertDiv.style.zIndex = 999;
            insertDiv.style.cursor = 'pointer';
            insertDiv.style.borderRadius = '6px';
            insertDiv.style.display = 'flex';
            insertDiv.style.justifyContent="space-evenly";
            insertDiv.style.alignItems="center";
            insertDiv.style.color = '#000';
            insertDiv.style.boxShadow = '0px 4px 24px 0px rgba(0,0,0,0.1)';
            insertDiv.style.fontSize = '12px';
            insertDiv.style.borderRadius = '6px';
            insertDiv.style.cursor = 'pointer';

            // Create the transcript div
            const transcriptDiv = document.createElement('div');
            transcriptDiv.className = 'transcript';
            // transcriptDiv.onclick = this.transcript(); 
            transcriptDiv.style.display="flex";
            transcriptDiv.style.alignItems="center";
            transcriptDiv.style.justifyContent="center";
            const transcriptImg = document.createElement('img');
            transcriptImg.src = require('./../assets/icons/transcript.png');
            transcriptImg.alt = '';
            const transcriptText = document.createTextNode(' 插入笔录');
            transcriptDiv.addEventListener('click',this.transcript);

            // Append image and text to the transcript div
            transcriptDiv.appendChild(transcriptImg);
            transcriptDiv.appendChild(transcriptText);

            // Create the vertical line span
            const verticalLine = document.createElement('span');
            verticalLine.className = 'verticalLine';

            // Create the bookmark div
            const bookmarkDiv = document.createElement('div');
            bookmarkDiv.className = 'bookmark';
            bookmarkDiv.addEventListener('click',this.bookmark);
            bookmarkDiv.style.display="flex";
            bookmarkDiv.style.alignItems="center";
            bookmarkDiv.style.justifyContent="center";
            // Create the bookmark image and text
            const bookmarkImg = document.createElement('img');
            bookmarkImg.src = require('./../assets/icons/bookmark.png');
            bookmarkImg.alt = '';
            const bookmarkText = document.createTextNode(' 插入书签');
            transcriptImg.style.width = '14px';
            transcriptImg.style.height = '14px';
            bookmarkImg.style.height = '14px';
            bookmarkImg.style.width = '14px';
            // Append image and text to the bookmark div
            bookmarkDiv.appendChild(bookmarkImg);
            bookmarkDiv.appendChild(bookmarkText);

            // Append transcript div, vertical line, and bookmark div to the main container div
            insertDiv.appendChild(transcriptDiv);
            insertDiv.appendChild(verticalLine);
            insertDiv.appendChild(bookmarkDiv);
            container.appendChild(insertDiv);
            container.appendChild(newDiv);
            this.insert = insert;
      // 遍历文本数组，找到目标文本
    },
     // 清除选中框
     clearSelection() {
      console.log('123');
      let selection = document.getElementsByClassName('selection-boxd');
      let insert = document.getElementsByClassName('insert');
      console.log(selection,insert,'insert');
      if (selection.length > 0) {
          // 将 HTMLCollection 转换为数组
          selection = Array.from(selection);

          // 遍历数组并移除每个元素
          selection.forEach(function(element) {
              element.parentNode.removeChild(element);
          });
          this.insert = null;
      }
      if(insert.length>0){
          insert = Array.from(insert);
          insert.forEach(function(element) {
              element.parentNode.removeChild(element);
          });
          this.insert = null;
      }
    },
    findInArray(targetArray, sourceArray) {
      let targetLength = targetArray.length;
      let sourceLength = sourceArray.length;
      let targetIndex = 0;
      let charIndex = [];
      for (let sourceIndex = 0; sourceIndex < sourceLength; sourceIndex++) {
        let currentChar = sourceArray[sourceIndex].str;
        if (currentChar == targetArray[targetIndex]) {
          targetIndex++;
          charIndex.push(sourceIndex);
        } else {
          targetIndex = 0;
          charIndex = [];
        }
        if (targetIndex == targetLength) {
          break;
        }
      }
      return { charIndex };
    },
   
  }
};
</script>

<style lang="less" scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
}
canvas {
  // width: 100%;
  // height: 100%;
}
#text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  // width: 100% !important;
}
#text-overlay div span::selection{
  background: #C5E2FA;
  color: #000;
}
.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
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
