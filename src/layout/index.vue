<template>
  <div class="app-wrapper">
    <!-- <TopCommon class="test"></TopCommon> -->
    <div class="app-main" >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopCommon from "./topCommon.vue";
import { Base64 } from "@/utils/base64";
import { encryptString, decodeString } from "@/utils/encrypt";
import { Decrypt, Encrypt } from "@/utils/urlEncrypt";
import { getUserInfo } from "@/api/api";
export default {
  name: "Layout",
  components: {
    TopCommon
  },
  data() {
    return {};
  },
  async created() {
    // await this.getBmsah(); //获取
    // this.getUser();
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var monthTwo = date.getMonth();
    var day = date.getDate();
    var day2 = date.getDate() - 1;
    var hour = date.getHours();
    var second = date.getSeconds();
    var minute = date.getMinutes();
    var week = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    var weeks = date.getDay();
    let data =
      this.addZeros(year) +
      "-" +
      this.addZeros(month) +
      "-" +
      this.addZeros(day);
    let data2 =
      this.addZeros(year) +
      "-" +
      this.addZeros(monthTwo) +
      "-" +
      this.addZeros(day);
    sessionStorage.setItem("nowTime", data);
    sessionStorage.setItem("beforeTime", data2);
  },
  mounted() {
    // this.getUserInfoData();
  },
  methods: {
    addZeros(s) {
      return s < 10 ? "0" + s : s;
    },
    getUserInfoData() {
      getUserInfo({
        dwbm: sessionStorage.getItem("dwbm"),
        rybm: sessionStorage.getItem("rybm"),
      }).then(res=>{
        if (res.code == 0) {
        // console.log("res----", res);
        sessionStorage.setItem("dwmc", res.data.dwmc);
        sessionStorage.setItem("rymc", res.data.rymc);
        this.$store.commit("user/SET_USER_INFO", {
          rybm: res.data.rybm,
          rymc: res.data.dwmc,
          dwbm: res.data.dwbm,
          dwmc: res.data.dwmc,
          // gnbm: sessionStorage.setItem("gnbm"),
        });
        // this.$store.dispatch("setRymc", res.data.rymc);
      }
      })
      
    },
    //从地址解密获取当前案件信息
    getBmsah() {
      // let urlStr = window.location.href;
      // let urlStr =
      "http://192.168.0.950:4000/dzjzzz?91a220f4b7b274a19144ce1b7cddf5debe6c15b895cf3d3db80d432dbea69c8cea8bf7b8659f29b1d3f93106348c521374eb02b533da7e9c1ca6f78bb277c9c0d6ab7114665ba10a7946b86392aafc3b3347b5e97f9d1bbd8ba17fdae4ffe8ee95f1e494b1263502d81579de1138c2d806aa60ccecd6e0bf5a36de780d9e081b8d1b1fc7d6848182e5a1012e76cd41e976ce1f340673f56dad7eedde04b90126";
      // let urlStr =
      // ("http://143.74.5.110:4000/dzjzzz/docprocessor?92bb20f4b7b274a69744c81b7fc8f7d8ee234aedd792147baf0b423ea9a1ecfbfa9cf0b519f83eb6a48b221133fc250363ec76c854cd799341f9a7d6d271a8c680a42a023157d4046844ef1595e9f63d1734a8e828c16dfd89ae348aa1e4a9afd6b0e6d7e0066443e93e79de1135c6d604e83ae6fdd194bd03307ec2");
      //截取地址栏传递参数
      urlStr = urlStr.substring(urlStr.indexOf("?") + 1);
      // console.log("url----", decodeString(urlStr).split("&"));
      // 根据&符号生成数组，并且第一道 Decrypt 解码
      let parameterArray = decodeString(urlStr).split("&");
      //创建对象接受地址栏信息
      var requestParameters = new Object();
      // 数组遍历生成对象，可以根据key值获取属性
      for (var i = 0; i < parameterArray.length; i++) {
        requestParameters[parameterArray[i].split("=")[0]] =
          parameterArray[i].split("=")[1];
      }
      // console.log(
      //   "requestParameters",
      //   decodeURIComponent(Base64.decode(requestParameters))
      // );
      // 进行url及base64两次解码，得到对象信息
      let ajxx = JSON.parse(
        decodeURIComponent(Base64.decode(requestParameters.ajxx))
      );
      let yhxx = JSON.parse(
        decodeURIComponent(Base64.decode(requestParameters.yhxx))
      );
      let dzbm = requestParameters.dzbm;
      // console.log("yhxx 当前登录人信息，动态参数", yhxx);
      // console.log("==================");
      // console.log("ajxx 案件相关信息，动态参数", ajxx);
      // console.log("==================");
      // console.log("dzbm 动作编码", dzbm);
      // let bmsah1 = sessionStorage.getItem("BMSAH1");
      // console.log("bmsah1----", bmsah1);
      // this.bmsah = ajxx.bmsah; //当前测试注释，正式上线解除
      // if (bmsah1) {
      //   this.bmsah = bmsah1;
      // }
      // this.uid = yhxx.rybm;
      // this.ajmc = ajxx.ajmc;
      // sessionStorage.setItem("UID", this.uid);
      // sessionStorage.setItem("bmsah", ajxx.bmsah);
      // sessionStorage.setItem("rymc", yhxx.rymc);
      // sessionStorage.setItem("dwbm", yhxx.dlrdwbm);
      // sessionStorage.setItem("dwmc", yhxx.dwmc);
      // sessionStorage.setItem("rybm", yhxx.rybm);
    },
    getUser() {
      let url = window.location.href;
      // let url="http://192.168.0.950:4000/dzjzzz?91a220f4b7b274a19144ce1b7cddf5debe6c15b895cf3d3db80d432dbea69c8cea8bf7b8659f29b1d3f93106348c521374eb02b533da7e9c1ca6f78bb277c9c0d6ab7114665ba10a7946b86392aafc3b3347b5e97f9d1bbd8ba17fdae4ffe8ee95f1e494b1263502d81579de1138c2d806aa60ccecd6e0bf5a36de780d9e081b8d1b1fc7d6848182e5a1012e76cd41e976ce1f340673f56dad7eedde04b90126"
      // let urlStr = "http://143.168.9.243/gaHome?82b532fcb7b274efc715970e7edba489fc2502bdb691756cab59666ce7feaa9cfcfda5e143d63eb6a7ac794760a1420502fb71c524dd0e9c0eb1f08cc27addd7d1a67b046c5cc60e6946b86393aafc3b4336d19e6f966daa8caf3d99a5b3a3bfa1b3ad83b750743295556ed915698d884ebd66baeda7e9a95833c97f02d5544bd50c19c2d0958384e7a4742863ce51e9759e2f7d5b21ae36c90c8cdd8eb4dbdefc082fc128d137c6995679401b5da1b67f4a79fa0a734ea096555c26dc348d585ab1288c21d818217ff35db6a4e46cef73f03bd4281a40fb3dfa66b66e8e7f14d001f3ecfbc073368b49422d86e6eefc46c0de22c78da7250641b062a33a989e05e7d7f2fac55ea05d111daf05aaef49&X-IDENTITY=%27eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJud0RoYWRNamdlNXh4Qzg2ZDYxRGt2UXgzbkpkOXhBVSIsImlhdCI6MTU2Mjc0OTU4NSwiZXhwIjoxNTk0Mjg1NTg1fQ.CdYUX8x9oEQsxTrtdznMH0S9057axEOXfTdPFnoSOBo%27";
      //let urlStr ="http://143.168.9.148/gaHome?82b532fcb7b274efc715970e7edba489fc2502bdb691756cab59666ce7feaa9cfcfda5e143d63eb6a7ac794760a1420502fb71c524dd0e9c0eb1f08cc27addd7d1a67b046c5cc60e6946b86393aafc3b4336d19e6f966daa8caf3599a5b3a3bfa1b0ad83b75074319e556ed915698d8a4ebd66baeda7e6a95833c97f02af544bd50c19c2a3958384e7a4742863ce51e9759f287d5b21ae36b1788cdd8eb4dbdef1082fc128d14db5995679401b26a1b67f4a79fa7a0959a291544c55af238a582cb121853dda1e237a8658a3a1f46cef79835bd3381a40f03fe712a66e8e7863a00600001e24";
      //截取地址栏传递参数
      let urlStr = url.substring(url.indexOf("?") + 1);
      let index = urlStr.indexOf("#/");
      let testUrl = urlStr.substring(0, index);
      urlStr = testUrl;
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
      // console.log('测试--------------',requestParameters.rybm)
      this.getUserInfoData();
    },
  },
};
</script>

<style lang="less">
.test{
  position: absolute;
  top: 0%;
  left: 0%;
}
.app-wrapper{
  height: 100%;
  overflow-y: auto;
}
.app-main{
  box-sizing: border-box;
    height: 100vh;
    // padding: 10px 12px;
    // padding-top: 80px;
}
</style>