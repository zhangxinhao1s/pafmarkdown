<template>
 <div class="content">
    <div class="close-btn" @click="handleClose"><i class="el-icon-close"></i></div>
    <p class="clipboard-title">剪贴板</p>
    <div class="clipboard-content">
        <div class="clipboard-list" v-for="item in clipboardList">
            <div class="item">
                <div class="left">
                    <div class="title"> <span></span> {{ item.title }}</div>
                    <div class="main">
                <div class="contes"> <span class="name">时间:</span> {{ item.time }}</div>
                <div class="contes"> <span class="name">摘要:</span> {{ item.abstract }}</div>
                <div class="contes"> <span class="name">证据小结:</span> {{ item.briefSummary }}</div>
                <div class="contes"> <span class="name">风险提示:</span> {{ item.prompt }}</div>
                <div class="contes" v-if="item.screenshot"><span class="name">截图图片:</span> <a style="color: #0B6ED9;">查看图片</a></div>
                </div>
                
            </div>
            <div class="right">
                    <i class="el-icon-document-copy" @click="handlecopy()"></i>
                    <i class="el-icon-delete" @click="handledel()"></i>
                </div>
            </div>
        </div>
    </div>
 </div>
</template>

<script>
export default {
  name: 'clipboard',
  props: {
    clipboardList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handlecopy(val){
        this.$emit('copy', val);
    },
    handledel(val) {
      this.$emit('delete', val);
    }
  }
}
</script>

<style lang="less" scoped>
  .close-btn{
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 14px;
    color: #999;
    cursor: pointer;
  }
  .clipboard-title{
    font-size: 16px;
    margin:0;
    font-weight: bold;
  }
  .clipboard-content{
    overflow: auto;
    height: 515px;
  }
  .clipboard-list{
    background-color: #F6F8FB;
    width: 100%;
    // height: 150px;
    padding: 15px;
    margin:10px 0px;
    .item{
        display: flex;
        .left{
            .main{
                margin-top: 9px;
            }
            .title{
            height: 19px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items:center;
            
            span{
                border-left: 3px solid #000;
                height: 15px;
                margin-right: 5px;
                display: inline-block;
            }
            
            }
            .contes{
                font-size: 11px;
                width: 236px;
                line-height: 23px;
                white-space: nowrap; /* 禁止换行 */
                overflow: hidden; /* 超出部分隐藏 */
                text-overflow: ellipsis; /* 超出部分显示省略号 */
            }
            .name{
                color: #999;
                font-size: 11px;
                margin-right: 5px;
                }
        }
        .right{
            flex: 1;
            font-size: 16px;
            display: flex;
            height: 16px;
            justify-content: space-between;
            color: #999 ;
            i{
            cursor: pointer;
            }
        }
    }
  }
</style>
