<template>
    <div ref="fan">
      <div :id="PdfContent" style="height:100%;" :style="PDFSize">
        <canvas :style="PDFSize" :id="idCanvas" :dataid="`data-id-${index}`"/>
      </div>
    </div>
  </template>
  
  <script>
  import { VueCropper } from "vue-cropper"; //图片截图
  // 引入依赖
  import elementResizeDetectorMaker from "element-resize-detector";//监听dom宽高变化
  import PDFJS from "pdfjs-dist";
  import { TextLayerBuilder } from "pdfjs-dist/web/pdf_viewer";
  import "pdfjs-dist/web/pdf_viewer.css";
  window.pdfjsWorker = require("pdfjs-dist/build/pdf.worker");
  import _ from 'lodash'
  export default {
    props: ["url", "PdfContent", "idCanvas", "PdfHeight", "index"],
    components: {
      VueCropper,
    },
    data() {
      return {
        value:"",
        //OCR
        link: "22",
        cutFlag: false,
        model: false,
        modelSrc: "",
        crap: false,
        previews: {},
        option: {
          // 裁剪图片的地址
          img: "",
          // 裁剪生成图片的质量
          size: 1,
          // 输出原图比例截图 props名full
          full: true,
          // 裁剪生成图片的格式
          outputType: "png",
          // 上传图片是否可以移动
          canMove: false,
          // 固定截图框大小 不允许改变
          fixedBox: false,
          // 上传图片按照原始比例渲染
          original: true,
          // 截图框能否拖动
          canMoveBox: true,
          // 是否默认生成截图框
          autoCrop: false,
          // 只有自动截图开启 宽度高度才生效
          // 默认生成截图框宽度
          autoCropWidth: 200,
          // 默认生成截图框高度
          autoCropHeight: 150,
          // 截图框是否被限制在图片里面
          centerBox: false,
          // 是否按照设备的dpr 输出等比例图片
          high: true,
        },
        show: true,
        // 是否开启截图框宽高固定比例
        fixed: false,
        // 截图框的宽高比例
        fixedNumber: [1, 2],
        // 裁剪框的大小信息
        info: true,
        // canScale 图片是否允许滚轮缩放
        canScale: true,
        // infoTrue  true 为展示真实输出图片宽高 false 展示看到的截图框宽高:
        infoTrue: true,
        // maxImgSize  限制图片最大宽度和高度
        maxImgSize: 2000,
        // enlarge 图片根据截图框输出比例倍数
        enlarge: 1,
        // mode  图片默认渲染方式
        mode: "contain",
        //OCR
        pdfUrl: this.url,
        pdfDoc: null, // pdfjs 生成的对象
        pageNum: 1, //
        pageRendering: false,
        pageNumPending: null,
        scale: 1, // 放大倍数
        page_num: 0, // 当前页数
        page_count: 0, // 总页数
        maxscale: 3, // 最大放大倍数
        minscale: 0.3, // 最小放大倍数
        iswidth:null,
        isheight:null,
        viewportHeight:null,
        viewportWidth:null,
        mountedFlag: false,
        PDFSize: {}
      };
    },
    computed: {},
    created() {
      this.init(this.url)
    },
    mounted(){
      this.watchSize();
    },
    watch: {
      url(newvalue, oldvalue) {
        this.pdfUrl = newvalue;
        this.init(this.pdfUrl);
      },
      // PdfHeight() {
      //   this.queueRenderPage(1);
      // }
    },
    //销毁事件
    destroyed() {},
    computed: {
      ctx() {
        const id = document.getElementById(this.idCanvas);
        return id.getContext("2d");
      },
    },
    methods: {
      watchSize() {
        const _this = this;
        var erd = elementResizeDetectorMaker();
        erd.listenTo(this.$refs.fan, (element) => { // 这里的this.$refs.fan指定要监听的元素对象，对应的是<div ref="fan"></div>
          var width = element.offsetWidth;
          var height = element.offsetHeight;
          _this.$nextTick(() => { // 这里填写监听改变后的操作
            this.iswidth=width
            this.isheight=height
            // this.debounceGetImg(this)
          });
        });
      },
      startCrop() {
        // start
        this.crap = true;
        this.$refs.cropper.startCrop();
      },
      stopCrop() {
        //  stop
        this.crap = false;
        this.$refs.cropper.stopCrop();
      },
      clearCrop() {
        // clear
        this.cutFlag = false;
        this.$refs.cropper.clearCrop();
      },
      // 实时预览函数
      realTime(data) {
        this.previews = data;
        this.$emit("", this.previews);
        // console.log(data);
      },
      imgLoad(msg) {
        // console.log(msg);
      },
      // OCR
      // 初始化pdf
      init(pdfUrl) {
        let _this = this;
        let base64 = pdfUrl; //获得bas464编码
        let decodedBase64 = atob(base64); //使用浏览器自带的方法解码
        PDFJS.getDocument({ data: decodedBase64, decodedBase64 }).then(function (
          pdfDoc_
        ) {
          _this.pdfDoc = pdfDoc_;
          _this.page_count = _this.pdfDoc.numPages;
          _this.renderPage(_this.pageNum);
        });
      },
      scaleUpdate(scale) {
        this.renderPage(1)
      },
      // 渲染pdf
      renderPage(num) {
        const vm = this;
        this.pageRendering = true;
        const canvas = document.getElementById(vm.idCanvas);
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then(function (page) {
          var viewport1 = page.getViewport(1);
          var viewport = page.getViewport(vm.PdfHeight / viewport1.height);
          vm.PDFSize = {
            width: viewport.width + 'px',
            height: viewport.height + 'px'
          }
          vm.$emit('getPDFSize', vm.PDFSize)
          // console.log(viewport1.height, viewport.width)
          vm.viewportHeight=viewport1.height
          vm.viewportWidth=viewport1.width
          canvas.height = viewport.height;
          vm.pdfWidth = canvas.width = viewport.width;
          canvas.style.width ="100%";
            canvas.style.height ="100%";
        // // document.getElementById(vm.idCanvas).getBoundingClientRect().width=1200+'px'
          vm.$emit('func',canvas.height)
        //   // Render PDF page into canvas context
          var renderContext = {
            canvasContext: vm.ctx,
            viewport: viewport,
          };
          page
            .render(renderContext)
            .then(() => {
              return page.getTextContent();
            })
            .then((textContent) => {
              // 创建文本图层div
                const textLayerDiv = document.createElement("div");
                textLayerDiv.setAttribute("class", "textLayer");
                textLayerDiv.setAttribute("id", "textLayer" + vm.index);
                textLayerDiv.setAttribute("data-html2canvas-ignore", "");
                textLayerDiv.setAttribute(
                  "style",
                  `width: margin: 2px auto;`
                );
                // 将文本图层div添加至每页pdf的div中`
                const id = document.getElementById(vm.PdfContent);
                id.setAttribute("style", "position: relative");
                //防止重复文本层添加
                if(id.querySelector('.textLayer')){
                  id.replaceChild(textLayerDiv, id.querySelector('.textLayer'));
                }else{
                id.appendChild(textLayerDiv);
                }
                // 创建新的TextLayerBuilder实例
                var textLayer = new TextLayerBuilder({
                  textLayerDiv: textLayerDiv,
                  pageIndex: page.pageIndex,
                  viewport: viewport,
                });
                textLayer.setTextContent(textContent);
                textLayer.render();
                vm.pageRendering = false;
                if (vm.pageNumPending !== null) {
                  // New page rendering is pending
                  vm.renderPage(vm.pageNumPending);
                  vm.pageNumPending = null;
                }
                if (!vm.mountedFlag) {
                  vm.$nextTick(() => {
                    setTimeout(() => {
                      vm.$emit('getImg')
                      vm.mountedFlag = true
                    }, 100)
                  })
                }
            });
        });
        vm.page_num = vm.pageNum;
      },
      // 放大
      addscale() {
        if (this.scale >= this.maxscale) {
          return;
        }
        this.scale += 0.2;
        this.queueRenderPage(1);
      },
      // 缩小
      minus() {
        if (this.scale <= this.minscale) {
          return;
        }
        this.scale -= 0.2;
        this.queueRenderPage(1);
      },
      //重新渲染
      queueRenderPage(num) {
        if (this.pageRendering) {
          this.pageNumPending = num;
        } else {
          this.renderPage(num);
        }
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  #pdf {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
    padding: 2px 0px 10px 0px;
  }
  // OCR
  .icon-OCR {
    position: absolute;
    right: 50px;
  }
  .cut {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 999;
  }
  .otip {
    margin: 10px;
    font-size: 12px;
    width: 55px;
    height: 20px;
    line-height: 20px;
    background-color: #fff;
    text-align: center;
    box-shadow: 5px 5px 6px #2f2f2f;
    display: none;
    color: #818181;
    border: 1px solid #818181;
    position: absolute;
    bottom: -24px;
    right: -50px;
  }
  // /deep/.vue-cropper[data-v-6dae58fd]{
  //   z-index:9999;
  // }
  .cutdiv{
    position:absolute;
    top: 0;
  }
  //OCR
  </style>