<template>
 <div class="content">
   <div class="catalogue">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
   </div>
 </div>
</template>

<script>
import {
  cataloguefile,
  catalogueTree,
} from "../api/wjgl";
export default {
  name: 'electronicFile',
  data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    mounted() {
      this.getCaseList();
    },
    methods: {
      async getCaseList() {
        let params = {
          jzbh:'dba31372c0c4365e1578d8cc4af0c2d7'
        };
      let res = await catalogueTree(params);
      if (res.code == 0) {
       
      } else {
        console.log("error");
      }
    },
      handleNodeClick(data) {
        console.log(data);
      }
    }

}
</script>

<style lang="less" scoped>
.content {
  padding: 10px;
  .catalogue{
    position: absolute;
    left: 0;
    background-color: #fff;
    height: 80%;
    width: 230px;
    top: 80px;
    border: 1px solid #e8e8e8;
    margin: auto;
    padding: 16px;
    z-index: 20;
    transition: transform 0.3s ease
  }
}
</style>
