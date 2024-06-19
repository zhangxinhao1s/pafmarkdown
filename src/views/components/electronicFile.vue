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
       default-expand-all
       :filter-node-method="filterNode"
       @node-click="handleNodeClick"
       @node-expand="handleNodeExpand"></el-tree>
    </div>
    <PdfViewer :openleft="openleft" v-if="pdfData" @reachedBottom="bottomclick" :jsonObj="jsonObj" :base64pdf="pdfData" />
  </div>
 </template>
 
 <script>
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
       }
     },
   data() {
       return {
         data: [],
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
      //  加载目录三级节点1
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
       async handleNodeExpand(node, data) {
     
         if (!data.fmlbh || data.childNodes.length > 0) {
           return;
         }
       
         let params = {
           mlbh: data.mlbh,
           jzbh: 'dba31372c0c4365e1578d8cc4af0c2d7'
         };
         let res = await cataloguefile(params);
         if (res.code == '0') {
           this.append(data, res.data);
         } else {
           console.log("error");
         }
       },
       append(data, res) {
         let arr = [];
         arr = res[0].children[0].jzmlwj;
     
         arr.forEach(item => {
           // Create a new child object with properties from the current item
           const newChild = {
             id: item.wjsxh,
             label: item.wjxsmc,
             wjxh: item.wjxh,
             children: [],
             isLeaf: true // Mark new children as leaf nodes
           };
           // Ensure data.children is initialized as an array if it does not already exist
           if (!Array.isArray(data.children)) {
             this.$set(data, 'children', []);
           }
 
           // Add the new child object to the children array
           data.children.push(newChild);
         });
         // After appending children, mark the node as not a leaf
         this.$set(data, 'isLeaf', false);
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
           console.log(this.jsonObj  ,'this.jsonObj  ');
         } else {
           console.log("error");
         }
     },
     bottomclick() {
      console.log('333');
      // this.pdfData = ''; 
     }
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
 </style>
  