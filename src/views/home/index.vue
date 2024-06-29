<template>
  <div class="content-box">
    <!-- <Title :title="'卷宗制作列表'"></Title> -->
    <div class="top-title">
      <div class="top-left">
        <img src="@/assets/icons/logo.png" alt="" />
        <span>辅助办案平台（张三危险驾驶案）</span>
      </div>
      <el-input
        placeholder="请输入关键字搜索..."
        prefix-icon="el-icon-search"
        v-model="searchValue">
      </el-input>
      <ul class="top-right" >
        <li v-for="item in tittleData" :key="item.name" @click="handleClick(item)"> 
        <el-popover
          placement="bottom"
          width="80"
          v-if="item.type === '2'"
          trigger="click"
          >
          <div class="tool-box">
            <p class="tip">证据分析</p>
            <p class="tip">笔录比对</p>
          </div>
          <span slot="reference"><img :src="item.img" alt="" />{{item.name}} <i class="el-icon-arrow-down"></i> </span>
        </el-popover>
          <span v-else><img :src="item.img" alt="" />{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <Main :titileName="titileName" ></Main>
  </div>
</template>

<script>
import { Decrypt, Encrypt } from "@/utils/urlEncrypt";
import Main from "./components/main.vue";
export default {
  components: {
    Main
  },
  data() {
    return {
      searchValue:'',
      titileName:{},
      tittleData:[
        {
          name: "阅卷笔录",
          value:'markingRecord',
          type: "1",
          img:require('@/assets/svg/markingPapers.svg')
        },
       
        {
          name: "案件审查",
          value: 'caseReview',
          type: "1",
          img:require('@/assets/svg/examine.svg')
        },
        {
          name: "智能问答",
          value: 'intelligentQuestion',
          type: "1",
          img:require('@/assets/svg/qaqa.svg')
        },
        {
          name: "案卡回填",
          value: 'caseCard',
          type: "1",
          img:require('@/assets/svg/caseCard.svg')
        },
        {
          name: "文书制作",
          value: 'document',
          type: "1",
          img:require('@/assets/svg/documen.svg')

        },
        {
          name: "工具箱",
          type: "2",
          img:require('@/assets/svg/toolbox.svg')
        }
      ],
     
     
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {

    
  },
  watch: {
  
  },
  methods: {
    handleClick(val){
      if(val.type !== '2'){
        this.titileName = val;
      }
    },
    // 获取页面登陆信息
    getUserInfo() {
      let url = window.location.href;
      let urlStr = url.substring(url.indexOf("?") + 1);
      // console.log("url", urlStr);
      // let index = urlStr.indexOf("#/");
      // let testUrl = urlStr.substring(0, index);
      // urlStr = testUrl;
      // console.log("url1111", testUrl);
      // console.log("地址栏参数", urlStr);
      // 根据&符号生成数组，并且第一道 Decrypt 解码
      let parameterArray = Decrypt(urlStr).split("&");
      // console.log("第一次解密", parameterArray);
      //创建对象接受地址栏信息
      var requestParameters = new Object();
      // 数组遍历生成对象，可以根据key值获取属性
      for (var i = 0; i < parameterArray.length; i++) {
        requestParameters[parameterArray[i].split("=")[0]] =
          parameterArray[i].split("=")[1];
      }
      // console.log("requestParameters======>", requestParameters);
      // console.log("111", decodeURIComponent(requestParameters.gnmc));
      sessionStorage.setItem("dwbm", requestParameters.dwbm);
      sessionStorage.setItem("gnbm", requestParameters.gnbm);
      sessionStorage.setItem(
        "gnmc",
        decodeURIComponent(requestParameters.gnmc)
      );
      sessionStorage.setItem("rybm", requestParameters.rybm);
      // console.log(
      //   this.$store.state.user.userInfo,
      //   this.searchForm,
      //   "解密后数据"
      // );
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.current-row{
  .el-table__cell{
    background: #096DD9 !important;
    color: #fff;
  } 
}
/deep/.el-popper{
  padding: 0 0px !important;
  min-width: 100px !important;
}
.top-title{
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(
    270deg,
    #4cb2ff 0%,
    #0f69ca 65%,
    #1a6bc2 100%
  );
  .top-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 14px 24px;
    span {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #f4f9ff;
      letter-spacing: 0;
      margin-left: 10px;
    }
  }
  .top-right{
    display: flex;
    font-size: 12px;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 24px;
    li{
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #f4f9ff;
      letter-spacing: 0;
      font-weight: 400;
      margin-left: 24px;
      cursor: pointer;
      width: 67px;
      span{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    img{
      width: 16px;
      height: 20px;
    }
  }
  .btn {
    width: 140px;
    height: 40px;
    background: #fff;
    border-radius: 4px;
    border: 0px;
    margin-right: 20px;
    color: #096DD9 !important;
  }
}

.grayscale {
  filter: grayscale(100%);
}
.content-box {
  width: 100%;
  height: 100%;
  .el-input{
    width: 300px;
    border-radius: 50px;
    /deep/.el-input__inner{
      border-radius: 50px;
      background: rgb(18, 90, 166);
      color: #fff;
      border: none;
    }
  }
}
/deep/ .el-dialog__header {
  // padding: 24px 32px 0 24px;

  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 550;
    position: relative;
    padding-left: 10px;
    border-left: 4px solid #4084f0;
  }
}
.btn{
  width: 140px;
    height: 40px;
    background: #096dd9;
    border-radius: 4px;
    border: 0px;
}
.tool-box{
  width: 60px;
  .tip{
    text-align: center;
    margin:5px 0;
  }
}
</style>