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
        :render-content="renderContent"
       :filter-node-method="filterNode"
       :accordion=true
       :render-after-expand=false
       @node-click="handleNodeClick"
       @node-expand="handleNodeExpand"></el-tree>
    </div>
    <div class="box1" id="box1"  @scroll="scroller">
          <div
            class="infinite-list-item"
            v-for="(item, index) in count"
            :style="PDFSize"
            :key="index"
            id="demotest12"
          >
            <!-- 组件容器 -->
            <Pdf
              @getPDFSize="getPDFSize"
              v-if="item"
              :PdfHeight="PdfHeight"
              :url="item.url"
              :PdfContent="item.pdfId"
              :idCanvas="item.canvasId"
              :index="index"
              :style="PDFSize"
              class="pdfDist"
              ref="pdfId"
              @getImg="getImg"
            ></Pdf>
          </div>
    </div>
    <!-- <PdfViewer :openleft="openleft" v-if="pdfData" @reachedBottom="bottomclick" :jsonObj="jsonObj" :base64pdf="pdfData" /> -->
  </div>
 </template>
 
 <script>
import queue from "../../utils/queue.js"; //引入队列

 import PdfViewer from '@/components/pdf.vue';
 import {
   cataloguefile,
   catalogueTree,
   cataloguePdf,
 } from "../api/wjgl";

 export default {
   name: 'electronicFile',
   components: {
     PdfViewer
   },
   watch: {
       filterText(val) {
         this.$refs.tree.filter(val);
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
            this.$refs.Ltree.CurrentKey(this.yeArr[newvalue]);
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
          sessionStorage.setItem("wjxh", this.yeArr[newvalue].wjxh);
        },
        //滚动条的值
        SliderValue(newvalue, oldvalue) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
              // console.log('滚动条的值')
              this.index = this.yeArr.length - newvalue - 1;
            }, 300);
          },
        },
   data() {
       return {
         data: [],
         timer: null,
        suoyin: 0,
         initFlag:false,
         count: [], //url数组
          SliderValue: 0, //滚动条的反向取值
         yeArr:[],
         PDFSize: {
            width: "848px",
            height: "1200px",
         },
         index:0,
         openleft: true,
         pdfData:'',
         jsonObj:{},
         filterText: '',
         defaultProps: {
           children: 'children',
           label: 'label',
           isLeaf: 'isLeaf' // Use this to indicate if a node is a leaf
         }
       };
     },
    mounted() {
      this.getCaseList();
    },
    methods: {
      //滚动到哪个展示哪个index
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

      async close12(index) {
      let pdfElement = document.getElementsByClassName("infinite-list-item");
      let max = this.yeArr.length - 1;
      let lastIndex = index - 1 <= 0 ? 0 : index - 1;
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
      if (queue.size > 6) {
        // console.log("1", queue.dequeue());
        this.count.splice(queue.dequeue(), 1, null);
        if (queue.size > 6) {
          // console.log("2", queue.dequeue());
          this.count.splice(queue.dequeue(), 1, null);
          if (queue.size > 6) {
            // console.log("3", queue.dequeue());
            this.count.splice(queue.dequeue(), 1, null);
          }
        }
      }
      // console.log(queueList);
    },
    geturl(val){
      console.log(val);
    },
    // 展开左侧目录
    openCatalogue() {
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
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    //  目录点击事件
      async handleNodeClick(data) {
        if(data.wjxh){
        this.redpdf(data.wjxh)
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
        console.log("All third level nodes:", allThirdLevelNodes);
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
    async redpdf(wjxh){
        let params = {
          wjxh:wjxh
        }
        let res = await cataloguePdf(params);
        if (res.code == '0') {
          // console.log(res.data,'res.data');
          this.pdfData = 'data:application/pdf;base64,' + res.data.pdfImage;
          let base64Str = res.data.pdfPath;
          //  let decoder = new TextDecoder();
          //  let decodedString = decoder.decode(base64Str);
          this.jsonObj  = JSON.parse(base64Str).data;
        } else {
          console.log("error");
        }
    },
    renderContent(h, { node, data, store }) {
    return (
      <span>
        {data.wjxh ? (
          <i class="el-icon-price-tag" style="margin-right: 5px;"></i>
        ) : null}
        <span>{node.label}</span>
      </span>
    );
    },
    bottomclick() {
      console.log('333');
      // this.pdfData = ''; 
    },
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
     padding: 16px;
     z-index: 20;
     transition: transform 0.3s ease;
   }
 }
 /deep/.el-tree{
  overflow: auto;
  margin-top: 20px;
  height: 93%;
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

  .checkeditor,
  .checkeditors {
    position: absolute;
    top: 0px;
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
 </style>