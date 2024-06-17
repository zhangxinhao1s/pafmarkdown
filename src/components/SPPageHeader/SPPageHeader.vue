<template>
  <div class="page-header-container">
     <h3 >{{title}}</h3>
     <div class="header-right">
       <slot></slot>
       <el-button v-if='showBackBtn' @click="goBack" style="height:32px;padding:0px 10px">
         <i class="iconfont icon-fanhui"></i>
         <span>返回</span></el-button>
     </div>
  </div>
</template>
<script>
export default {
  name: "SPPageHeader",
  props: {
    title:String,
    showBackBtn:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {};
  },
  methods:{
    goBack(){
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.page-header-container {
   padding: 0 20px;
   height: 48px;
   background-color: @nav-bgc;
   display: flex;
   justify-content: space-between;
   align-items: center;
   color:@theme-stress;
   font-size: 16px;
   border-bottom: 1px solid @line-color;
   h3{
     font-size: 16px;
     font-weight: bold;
   }
   .header-right{
     display: flex;
     align-items: center;
   }
 
}
</style>
