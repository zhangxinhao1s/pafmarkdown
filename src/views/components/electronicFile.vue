<template>
  <div class="content">
    <div class="catalogue outline-container" :class="{'hidden': !openleft}">
      <div :class="{'checkeditor': openleft, 'checkeditors': !openleft}" @click="openCatalogue">
        <i class="el-icon-arrow-left" v-if="openleft"></i>
        <i class="el-icon-arrow-right" v-else></i>
      </div>
     <el-input
       placeholder="输入关键字进行过滤"
       v-model="filterText">
     </el-input>
     <el-tree
       :data="data"
       ref="tree"
       :props="defaultProps"
       highlight-current
       :current-node-key="currentNodeKey"
       :render-content="renderContent"
       :filter-node-method="filterNode"
       :accordion=true
       :render-after-expand=false
       @node-click="handleNodeClick"
       node-key="wjxh"
       @node-expand="handleNodeExpand"></el-tree>
    </div>
    <div class="controls">
      <span @click="zoomIn"> <img src="./../../assets/svg/zoomin.svg" alt="放大"></span>
      <span @click="zoomOut"> <img src="./../../assets/svg/zoomout.svg" alt="缩小"></span>
      <span @click="selfAdaption"> <img src="./../../assets/svg/selfAdaption.svg" alt="自适应"></span>
      <span @click="boxSelect"> <img src="./../../assets/svg/boxSelect.svg" alt="框选"></span>
      <span @click="takeScreenshot" > <img src="./../../assets/svg/screenshot.svg" alt="截图"></span>
    </div>
    <div
    class="box1"
    id="box1"
    ref="box1"
    :class="{'cav': leftop, 'avc': !leftop}"
    @scroll="scroller"
    >
      <div
        class="infinite-list-item"
        v-for="(item, index) in count"
        :style="PDFSize"
        :key="index"
        id="demotest12"
      >
        <!-- 组件容器 -->
        <Pdf
          ref="pdfId"
          @getPDFSize="getPDFSize"
          v-if="item"
          :url="item.url"
          :PdfHeight="PdfHeight"
          :PdfContent="item.pdfId"
          :idCanvas="item.canvasId"
          :index="index"
          :jsonObj="item.jsonObj"
          :tjsonObj="newObj"
          :style="PDFSize"
          class="pdfDist"
        ></Pdf>
      </div>
        <!-- <div v-if="selectedArea " class="selection-box" :style="selectionBoxStyle"></div> -->
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
    <!-- <PdfViewer :openleft="openleft" v-if="pdfData" @reachedBottom="bottomclick" :count="count" :base64pdf="pdfData" /> -->
  </div>
 </template>
 
 <script>
import queue from "../../utils/queue.js"; //引入队列
import html2canvas from 'html2canvas';
import PdfViewer from '@/components/pdf.vue';
import Pdf from '@/components/scorllpdf.vue';
 import {
   cataloguefile,
   catalogueTree,
   cataloguePdf,
 } from "../api/wjgl";

 export default {
   name: 'electronicFile',
   components: {
     PdfViewer,
     Pdf
   },
   watch: {
       filterText(newvalue) {
        this.$refs.tree.filter(newvalue)
       },
       //当前pdf在数组中的索引
       async index(newvalue, oldvalue) {
        // 根据索引生成pdf容器
        this.$nextTick(() => {
          if (!this.initFlag) {
            this.initFlag = true;
          //   this.getpdf(this.index);
            this.close12(newvalue);
          } else {
            if (this.timer) {
              clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
              // 拿到当前页的对应信息
              // this.getpdf(this.index);
              this.close12(newvalue);
            }, 300);
          }
          // this.$refs.Ltree.CurrentKey(this.yeArr[newvalue]);
        });
        let max = this.yeArr.length - 1;
        switch (newvalue) {
          case 0:
            this.SliderValue = max - newvalue;
            break;
          case `${max}`:
            this.SliderValue = max - newvalue;
            break;
          default:
            this.SliderValue = max - newvalue;
        }
       },
       //滚动条的值
       SliderValue(newvalue, oldvalue) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
              this.index = this.yeArr.length - newvalue - 1;
            }, 300);
       },
       currentNodeKey(newvalue, oldvalue){
        this.$refs.tree.setCurrentKey(newvalue)
        const node = this.$refs.tree.getNode(newvalue);
        // this.expandParentNodes(node);
       }
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
    },
  },
  data() {
    return {
      data: [],//节点树数据
      currentNodeKey:null,//当前选中的节点
      timer: null,//防抖定时器
      leftop: false,//目录展开判断
      initFlag:false,
      count: [], //url数组
      SliderValue: 0, //滚动条的反向取值
      yeArr:[],
      PDFSize: {
        width: "848px",
        height: "1200px",
      },//pdf容器大小初始值,只是暂定,进入页面会自动适配
      pageArr:[],
      index:0,//当前pdf在数组中的索引
      selecting:false,//控制截图框是否显示
      openleft: true,
      pdfData:null,
      jsonObj:{},//pdf数据
      newObj:{},//传入子组件的json数据-pdf数据
      filterText: null,
      PdfHeight: 800,//pdf容器高度
      insert:null,
      selectionStart: { x: 0, y: 0 },//截图框的位置(起点
      selectionEnd: { x: 0, y: 0 },//截图框的位置(终点
      selectedArea: null,
      dialogTableVisible: false,
      PDFHeightStatic: 800,
      PDFSizeStatic: {
      width: "848px",
      height: "1200px",
    },
      type:null,
      screenshot: null, // 用来保存截图的 Base64 数据
      ruleForm:{
        abstract: null,
        date:null,
        summary:null,
        prompt:null
      },
      scale: 1, // 放大倍数
      maxscale: 1.25, // 最大放大倍数
      minscale: 0.5, // 最小放大倍数
      scale2: 1, // 放大倍数
      maxscale2: 1.25, // 最大放大倍数
      minscale2: 0.5, // 最小放大倍数
      bookmarkx:null,
      bookmarky:null,
      oldvalue:0,
      level1Icon:require('./../../assets/svg/level1.svg'),
      level2Icon:require('./../../assets/svg/level2.svg'),
      defaultProps: {
        children: 'children',
        label: 'label',
        key: 'wjxh',
        isLeaf: 'isLeaf' // Use this to indicate if a node is a leaf
      }
      };
  },
  async mounted() {
    await this.getCaseList();
    
    await  this.selfAdaption()
  },
  created() {

  },
  directives: {
      resize: {
        inserted(el, binding) {
          const resizeObserver = new ResizeObserver((entries) => {
            binding.value(entries);
          });
          resizeObserver.observe(el);
        },
        unbind(el) {
          if (el._resizeObserver) {
            el._resizeObserver.disconnect();
          }
        },
      },
    },
  methods: {
    onResize(entries) {
      for (let entry of entries) {
        if (entry.target.classList.contains('box1')) {
          this.selfAdaption();
        }
      }
    },
    expandParentNodes(node) {
      if (node.parent) {
        this.$refs.tree.expandNode(node.parent, true);
        this.expandParentNodes(node.parent);
      }
    },
    // 取当前页的pdf数据并做防抖
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    },
    async scroller(e) {
      
      let element = e.srcElement;
      this.index = Math.floor(
        (element.scrollTop + element.clientHeight) / (this.PdfHeight + 10)
      );
      if( this.oldvalue !== this.index){
        let ur1 = await this.geturl(this.index); //获得base64
        this.newObj = ur1;
        this.currentNodeKey = this.newObj.canvasId;
      }
      this.oldvalue = this.index;
     
    },
    // 缓存pdf数据
    async close12(index) {
      let pdfElement = document.getElementsByClassName("infinite-list-item");
      let max = this.yeArr.length - 1;
      let lastIndex = index - 1 <= 0 ? 0 : index - 1;
      let firstIndex = index - 3 <= 0 ? 0 : index - 1;
      let twoIndex = index - 2 <= 0 ? 0 : index - 1;
      let fourIndex = index + 3 <= 0 ? 0 : index + 1;
      let fiveIndex = index + 2 <= 0 ? 0 : index + 1;
      let NextIndex = index + 1 >= max ? max : index + 1;
      let queueList = queue.print(); //打印队列内内容
      //  ---- paf 请求 ----
      if (pdfElement[index].lastChild.lastChild) {
      } else {
        let ur1 = await this.geturl(index); //获得base64
        this.count.splice(index, 1, ur1); //操作数组
        if (queueList.indexOf(index) == "-1") {
          queue.enqueue(index); //存入队列
        }
      }
      if (pdfElement[twoIndex].lastChild.lastChild) {
      } else {
        let ur1 = await this.geturl(twoIndex); //获得base64
        this.count.splice(twoIndex, 1, ur1); //操作数组
        if (queueList.indexOf(twoIndex) == "-1") {
          queue.enqueue(twoIndex); //存入队列
        }
      }
      if (pdfElement[fourIndex].lastChild.lastChild) {
      } else {
        let ur1 = await this.geturl(fourIndex); //获得base64
        this.count.splice(fourIndex, 1, ur1); //操作数组
        if (queueList.indexOf(fourIndex) == "-1") {
          queue.enqueue(fourIndex); //存入队列
        }
      }
      if (pdfElement[fiveIndex].lastChild.lastChild) {
      } else {
        let ur1 = await this.geturl(fiveIndex); //获得base64
        this.count.splice(fiveIndex, 1, ur1); //操作数组
        if (queueList.indexOf(fiveIndex) == "-1") {
          queue.enqueue(fiveIndex); //存入队列
        }
      }
      if (pdfElement[firstIndex].lastChild.lastChild) {
      } else {
        let ur1 = await this.geturl(firstIndex); //获得base64
        this.count.splice(firstIndex, 1, ur1); //操作数组
        if (queueList.indexOf(firstIndex) == "-1") {
          queue.enqueue(firstIndex); //存入队列
        }
      }
      if (pdfElement[NextIndex].lastChild.lastChild) {
      } else {
        let ur2 = await this.geturl(NextIndex); //获得base64
        this.count.splice(NextIndex, 1, ur2); //操作数组
        if (queueList.indexOf(NextIndex) == "-1") {
          queue.enqueue(NextIndex); //存入队列
        }
      }
      if (pdfElement[lastIndex].lastChild.lastChild) {
      } else {
        let ur = await this.geturl(lastIndex); //获得base64
        this.count.splice(lastIndex, 1, ur); //操作数组
        if (queueList.indexOf(lastIndex) == "-1") {
          queue.enqueue(lastIndex); //存入队列
        }
      }
      //清除队列内容，控制队列内数量
      if (queue.size > 7) {
        this.count.splice(queue.dequeue(), 1, null);
        if (queue.size > 7) {
          this.count.splice(queue.dequeue(), 1, null);
          if (queue.size > 7) {
            this.count.splice(queue.dequeue(), 1, null);
          }
        }
      }
    },
    //获取pdf的base64
    geturl(val){
     return this.redpdf(val)
    },
    // 展开左侧目录
    openCatalogue() {
      this.leftop = !this.leftop;
      this.openleft = !this.openleft;
      const proseMirror = document.querySelector('.toastui-editor-main');
      if (proseMirror) {
        if (this.openleft) {
          setTimeout(() => {
            proseMirror.classList.remove('closeds');
          }, 0);
        } else {
          setTimeout(() => {
            proseMirror.classList.add('closeds');
          }, 0);
        }
      }
    },
    // 获取目录列表
    async getCaseList() {
      let params = {
        jzbh: 'dba31372c0c4365e1578d8cc4af0c2d7'
      };
      let res = await catalogueTree(params);
      if (res.code == 0) {
        this.data = res.data;
        // Mark nodes with no children as leaf nodes
        this.markLeafNodes(this.data);
      } else {
        console.log("error");
      }
    },
    //  加载目录三级节点
    markLeafNodes(nodes) {
      nodes.forEach(node => {
        if (!node.children || node.children.length === 0) {
          this.$set(node, 'isLeaf', true);
        } else {
          this.markLeafNodes(node.children);
        }
      });
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 计算滚动条高度
    scrollToIndex(index) {
      const element = this.$refs.box1;

      // Calculate the scrollTop value based on the index and PDF height
      const scrollTop = index * (this.PdfHeight + 10);

      // Ensure the scrollTop value is within the valid range
      const maxScrollTop = element.scrollHeight - element.clientHeight;
      const adjustedScrollTop = Math.min(scrollTop, maxScrollTop);

      // Scroll to the calculated position
      element.scrollTop = adjustedScrollTop;
    },
    //  目录点击事件
    async handleNodeClick(data) {
      if(data.wjxh){
        this.currentNodeKey=data.id;
        this.index = data.id;
        this.scrollToIndex(this.index+1);
      //  this.redpdf(data.wjxh)
      }
      if (!data.fmlbh || data.children.length > 0) {
        return;
      }

      let params = {
        mlbh: data.mlbh,
        jzbh: 'dba31372c0c4365e1578d8cc4af0c2d7'
      };
      let res = await cataloguefile(params);
      if (res.code == '0') {
        this.append(data, res.data);
        // this.$emit('getfilelist', res.data);
      } else {
        console.log("error");
      }
    },
    //  目录展开事件
    async handleNodeExpand(node, data) {
    const maxDepth = this.calculateDepth(data)
      if (data.level !== 1 ||maxDepth==3){
        return;
      }
      let params = {
        mlbh: data.data.mlbh,
        jzbh: 'dba31372c0c4365e1578d8cc4af0c2d7'
      };
      let res = await cataloguefile(params);
      if (res.code == '0') {
        this.append(data, res.data);
        // 获取当前展开节点下的所有三级节点
        let allThirdLevelNodes = [];
        res.data.forEach(secondLevelNode => {
          if (secondLevelNode.children && secondLevelNode.children.length > 0) {
            secondLevelNode.children.forEach(thirdLevelNode => {
              if (thirdLevelNode.jzmlwj && thirdLevelNode.jzmlwj.length > 0) {
                allThirdLevelNodes.push(...thirdLevelNode.jzmlwj);
              }
            });
          }
        });
        this.count.length = allThirdLevelNodes.length;
        this.yeArr = allThirdLevelNodes;
      // console.log("All third level nodes:", allThirdLevelNodes);
      } else {
        console.log("error");
      }
    },
    //  添加子节点
    append(data, res) {
      // 遍历res中的每一个二级节点
      for (let i = 0; i < res.length; i++) {
        // 获取二级节点下的三级节点数组
        let jzmlwjArray = res[i].children[0].jzmlwj;
        // 获取对应的目标二级节点
        let targetNode = data.data.children[i];
        // 确保目标节点存在并且是一个数组
        if (Array.isArray(jzmlwjArray)) {
          // 遍历三级节点数组
          jzmlwjArray.forEach(item => {
            // 创建新的子节点对象
            const newChild = {
              id: item.wjsxh,
              label: item.wjxsmc,
              wjxh: item.wjxh,
              children: [],
              isLeaf: true // 标记新的子节点为叶子节点
            };

            // 确保目标节点的children属性被初始化为数组
            if (!Array.isArray(targetNode.children)) {
              this.$set(targetNode, 'children', []);
            }

            // 将新的子节点对象添加到目标节点的children数组中
            targetNode.children.push(newChild);
          });
        }
      }

      // 添加子节点后，将节点标记为非叶子节点
      this.$set(data.data, 'isLeaf', false);
    },
     //放大
    zoomIn() {
      if (this.scale >= this.maxscale) {
        return;
      }
      this.scale += 0.25;
      this.value = this.scale * 100;
      this.PdfHeight = this.PDFHeightStatic * this.scale;
      this.PDFSize = {
        width: parseInt(this.PDFSizeStatic.width) * this.scale + "px",
        height: parseInt(this.PDFSizeStatic.height) * this.scale + "px",
      };
      this.$refs.pdfId.forEach((v) => {
        v.scaleUpdate();
      });
      let box = document.querySelector("#box1");
      box.scrollTop = this.index * (this.PdfHeight + 10);
    },
    // 缩小
    zoomOut() {
      if (this.scale <= this.minscale) {
        return;
      }
      this.scale -= 0.25;
      this.value = this.scale * 100;
      this.PdfHeight = this.PDFHeightStatic * this.scale;
      this.PDFSize = {
        width: parseInt(this.PDFSizeStatic.width) * this.scale + "px",
        height: parseInt(this.PDFSizeStatic.height) * this.scale + "px",
      };
      this.$refs.pdfId.forEach((v) => {
        v.scaleUpdate();
      });
      let box = document.querySelector("#box1");
      box.scrollTop = this.index * (this.PdfHeight + 10);
    },
    // 复制到剪切板
    copy(){

    },
    // 自适应
    selfAdaption() {
      this.scale = 1;
      this.value = this.scale * 100;
      let width = document.querySelector(".box1").offsetWidth -10;
      this.PdfHeight =  (parseInt(this.PDFSizeStatic.height) * width) /
            parseInt(this.PDFSizeStatic.width);
      this.PDFSize = {
        width: parseInt(this.PDFSizeStatic.width) * this.scale + "px",
        height: parseInt(this.PDFSizeStatic.height) * this.scale + "px",
      };
      this.$refs.pdfId.forEach((v) => {
        v.scaleUpdate();
      });
      let box = document.querySelector("#box1");
      box.scrollTop = this.index * (this.PdfHeight + 10);
    },
    // 框选
    async boxSelect() {
      this.$nextTick(() => {
        if (this.$refs.pdfId && this.$refs.pdfId[0]) {
          this.$refs.pdfId[0].boxSelect();
        }
     });
    },
    // 点击截图
    takeScreenshot() {
       this.selecting = true;
      this.selectedArea = null;
      this.type='takeScreenshot';
    },
    extractTextFromSelection() {
      this.$refs.pdfId.extractTextFromSelection();
    },
    // 截图 - 鼠标按下选中
    startSelection(event) {
      this.selectedArea = true;
      this.selecting = true;
      const container = document.getElementById('box1');
      const containerRect = container.getBoundingClientRect();
      const width = !this.leftop ? 210 : 0;
      this.selectionStart = {
        x: event.clientX - containerRect.left +width-12,
        y: event.clientY - containerRect.top-12
      };
      console.log(this.selectionStart,'selectionStart');
      this.selectionEnd = {
        x: event.clientX - containerRect.left +width,
        y: event.clientY - containerRect.top
      };
    },
    // 截图 - 移动中
    resizeSelection(event) {
      this.selecting = true;
      if (this.selecting) {
        const container = this.$refs.box1;
        const containerRect = container.getBoundingClientRect();
        const width = !this.leftop ? 210 : 0;
        this.selectionEnd = {
          x: event.clientX - containerRect.left +width-12,
          y: event.clientY - containerRect.top -12
        };
      console.log(this.selectionEnd,'selectionEnd');
      }
      event.preventDefault();
    },
    // 截图 - 结束选中
    endSelection() {
      this.selecting = false;
      const width = !this.leftop ? 210 : 0;
      this.selectedArea = {
        x: (Math.min(this.selectionStart.x, this.selectionEnd.x)-width+12),
        y: Math.min(this.selectionStart.y, this.selectionEnd.y)+12  ,
        width: Math.abs(this.selectionEnd.x - this.selectionStart.x),
        height: Math.abs(this.selectionEnd.y - this.selectionStart.y)
      };
      let thisdiv = document.querySelector('.selection-box');
      thisdiv.style.display = 'none';
      if(this.type=='takeScreenshot'){
        if (!this.selectedArea) return;
        const { x, y, width, height } = this.selectedArea;
        const screenshotArea = this.$refs.box1;
        html2canvas(screenshotArea, {
          x,
          y,
          width,
          height
        }).then(canvas => {
          this.selectedArea = null;
          const image = canvas.toDataURL('image/png');
          this.dialogTableVisible = true; // 打开截图对话框
          this.screenshot = image; // 保存截图到 screenshot 变量
        });
      }
    },
    // 遍历目录最大深度
    calculateDepth(node, currentDepth = 1) {
      if (!node.childNodes || node.childNodes.length === 0) {
        return currentDepth;
      }
      
      let maxDepth = currentDepth;
      for (let child of node.childNodes) {
        const childDepth = this.calculateDepth(child, currentDepth + 1);
        if (childDepth > maxDepth) {
          maxDepth = childDepth;
        }
      }
      return maxDepth;
    },
    //  获取pdfbase64
    async redpdf(val){
        let params = {
          wjxh:this.yeArr[val].wjxh
        }
        let res = await cataloguePdf(params);
        if (res.code == '0') {
          this.pdfData = 'data:application/pdf;base64,' + res.data.pdfImage;
          let base64Str = res.data.pdfPath;
          //  let decoder = new TextDecoder();
          //  let decodedString = decoder.decode(base64Str);
          this.jsonObj  = JSON.parse(base64Str).data;
          return {
            url: res.data.pdfImage,
            pdfId: this.yeArr[val].wjxh + 1,
            canvasId: this.yeArr[val].wjxh,
            jsonObj:this.jsonObj,
            id:val
          }
        } else {
          console.log("error");
        }
    },
    // 给节点加图标
    renderContent(h, { node, data, store }) {
      let icon = '';
      if (node.level === 1) {
        icon = this.level1Icon;
      } else if (node.level === 2) {
        icon = this.level2Icon;
      }else if (node.level === 3) {
        return (
          <span>
            {data.wjxh ? (
              <i class="el-icon-price-tag" style="margin-right: 5px;"></i>
            ) : null}
            <span>{node.label}</span>
          </span>
        );
      }
      return h('span', [
        h('img', {
          attrs: {
            src: icon,
            alt: 'icon',
            style: 'width: 16px; height: 16px; margin-right: 4px;',
          },
        }),
        h('span', node.label),
      ]);
    },
    // 监听pdf大小变化
    getPDFSize(size) {
      this.PDFSize = size;
      this.PdfHeight = parseInt(size.height);
    },
  }
 }
 </script>
 
 <style lang="less" scoped>
 .content {
  justify-content: flex-end;
  margin-top: 30px;
  border-top:1px solid #ccc;
   .catalogue {
     position: absolute;
     left: 0;
     background-color: #fff;
     height: 84%;
     width: 210px;
     top: 65px;
     border: 1px solid #e8e8e8;
     margin: auto;
     padding: 0px;
     z-index: 20;
     transition: transform 0.3s ease;
   }
 }
 /deep/.el-tree{
  overflow: auto;
  margin-top: 20px;
  height: 93%;
  -ms-overflow-style: none;  /* 适用于Internet Explorer和Edge */
  scrollbar-width: none;  /* 适用于Firefox */
 }
 /deep/.el-tree::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
}
.el-input{
  margin: 16px;
  width: 82%;
}
 .outline-container {
  position: absolute;
  background-color: #fff;
  height: 80%;
  width: 300px;
  top: 80px;
  border: 1px solid #e8e8e8;
  margin: auto;
  padding: 16px;
  z-index: 20;
  transition: transform 0.3s ease;

  &.hidden {
    transform: translateX(-100%);
  }
  /deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    background: #096DD9;
    color: #fff !important;
  }
  .checkeditor,
  .checkeditors {
    position: absolute;
    top: 0px;
    z-index: 10;
    bottom: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
    width: 16px;
    height: 60px;
    background: #83b5eb;
    border-radius: 10px 0px 0px 10px;
    i {
      text-align: center;
      line-height: 60px;
      font-size: 20px;
      color: #fff;
    }
  }
  .checkeditors {
    right: -20px;
    border-radius: 0px 10px 10px 0px;
  }
}
/deep/.el-tree-node__label::before{
  content: "";
  display: inline-block;
  background-image: url(../../assets/icons/bookmark.png);
  width: 10px;
  height: 10px;
}
.box1 {
  overflow: auto;
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
  z-index: 30;
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
.pdfDist{
  // width: 100% !important;
}
.el-form-item {
  display: flex;
  flex-direction: column; 
}
/deep/.el-form-item__label{
  text-align: left;
}
/deep/.el-form-item__content{
  margin-left: 0 !important;
}
.el-dialog__body{
  padding: 23px 25px !important;
}
/deep/.el-textarea__inner {
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
.avc {
  width: calc(100% - 200px) !important;
  height: 100%;
}
.cav {
  width: 100%;
  height: 100%;
}
.infinite-list-item{
  height: var(--pdf-height);
  // width: 100% !important;
}
/deep/.el-tree-node__content{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}
/deep/
.el-tree-node__children{
  .el-tree-node{
    .el-tree-node__children{
      .el-tree-node{
        .el-tree-node__content{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          font-weight: 400;
        }
      }
    }
  }
}
/deep/.el-tree-node__content:hover{
  background: none;
}
 </style>