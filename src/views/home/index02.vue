<template>
  <div class="wjgl-home">
    <el-tabs type="border-card" style="height: 100%">
      <el-tab-pane label="外卷导入">
        <header style="margin-top: 10px">
          <el-form
            ref="form"
            :model="searchForm"
            label-width="120px"
            :inline="true"
            class="el-form-tab"
          >
            <el-form-item label="卷宗名称">
              <el-input
                v-model="searchForm.ajmc"
                clearable
                placeholder="请输入卷宗名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门受案号">
              <el-input
                v-model="searchForm.bmsah"
                clearable
                placeholder="请输入部门受案号"
              ></el-input>
            </el-form-item>
            <el-form-item label="起始时间">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                v-model="searchForm.cjkssj"
                clearable
                placeholder="请选择起始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                v-model="searchForm.cjjssj"
                clearable
                placeholder="请选择结束时间"
              ></el-date-picker>
            </el-form-item>

            <el-form-item style="float: right">
              <el-button
                @click="seccsus"
                size="small"
                type="primary"
                style="margin-left: 50px"
                >查询案件</el-button
              >
              <el-button @click="clearForm" size="small">重置查询</el-button>
            </el-form-item>
            <el-form-item label="案件来源">
              <el-select
                v-model="searchForm.ajly"
                placeholder="请选择案件来源"
                clearable
              >
                <el-option
                  v-for="(item, i) in ajlyOptions"
                  :key="i"
                  :label="item.msg"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="padding-left: 50px">
              <el-button
                @click="add"
                type="primary"
                size="small"
                v-show="isLook == 'N'"
                >新增案件</el-button
              >
              <!-- <el-tooltip
                class="item"
                effect="light"
                content="选中案件后再进行绑定操作"
                :disabled="!isBand"
              >
                <div class="tooltopBox">
                  <el-button
                    @click="bind('tPoint')"
                    size="small"
                    v-show="isLook == 'N'"
                    :disabled="isBand"
                    >绑定2.0案件</el-button
                  >
                </div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="light"
                content="选中案件后再进行绑定操作"
                :disabled="!isBand"
              >
                <div class="tooltopBox">
                  <el-button
                    @click="bind('case')"
                    size="small"
                    v-show="isLook == 'N'"
                    :disabled="isBand"
                    >绑定监督事项案件</el-button
                  >
                </div>
              </el-tooltip> -->
              <el-button
                @click="biz"
                size="small"
                v-show="isLook == 'N'"
                v-if="queryJdsxDataEnable"
                :disabled="!queryJdsxDataEnable"
                >导入监督事项</el-button
              >
              <el-button
                @click="importTP"
                size="small"
                v-show="isLook == 'N'"
                v-if="queryAjDataEnable"
                :disabled="!queryAjDataEnable"
                >导入2.0案件</el-button
              >
            </el-form-item>
          </el-form>
        </header>
        <main>
          <sp-table
            highlight-current-row
            :queryFunction="getCaseList"
            :isShowIndex="true"
            @rowClick="tableClick"
            ref="tabData"
          >
            <sp-table-column label="卷宗名称" prop="ajmc"> </sp-table-column>
            <sp-table-column label="部门受案号" prop="bmsah"> </sp-table-column>
            <sp-table-column label="案件类别名称" prop="ajlbmc">
            </sp-table-column>
            <sp-table-column label="册数" prop="dossierNum" width="80">
            </sp-table-column>

            <sp-table-column label="文件数" prop="fileNum" width="80">
            </sp-table-column>

            <sp-table-column label="创建日期" prop="createdAt">
              <template slot-scope="scope">
                <span> {{ changeTime(scope.row.createdAt) }}</span>
              </template>
            </sp-table-column>
            <sp-table-column label="制作人" prop="zzr"> </sp-table-column>
            <sp-table-column label="制作状态" prop="zzztStr">
              <template slot-scope="scope">
                <span
                  v-for="(item, i) in zzztOptions"
                  :key="i"
                  v-show="item.dictCode == scope.row.jhzt"
                >
                  {{ item.dictName }}</span
                >
              </template>
            </sp-table-column>
            <!-- <sp-table-column label="识别状态" prop="ocrztStr"> -->
            <!-- <template slot-scope="scope">
            <span
              v-for="(item, i) in jhOptions"
              :key="i"
              v-show="item.dictCode == scope.row.jhzt"
            >
              {{ item.dictName }}</span
            >
          </template> -->
            <!-- </sp-table-column> -->
            <sp-table-column label="案件来源" prop="ajly">
              <template slot-scope="scope">
                <span
                  v-for="(item, i) in ajlyOptions"
                  :key="i"
                  v-show="item.code == scope.row.ajly"
                >
                  {{ item.msg }}</span
                >
              </template>
            </sp-table-column>
            <sp-table-column label="操作" width="350">
              <template slot-scope="scope">
                <el-dropdown
                  trigger="click"
                  class="tipitem"
                  :disabled="scope.row.ajly != '0'"
                >
                  <span class="table-action"
                    ><i class="el-icon-paperclip"></i> 绑定<i
                      class="el-icon-arrow-down el-icon--right"
                    >
                    </i
                  ></span>
                  <el-dropdown-menu slot="dropdown">
                    <span
                      @click="bind('tPoint', scope.row)"
                      v-show="queryAjDataEnable"
                    >
                      <el-dropdown-item> 绑定2.0案件 </el-dropdown-item>
                    </span>
                    <span
                      @click="bind('case', scope.row)"
                      v-show="queryJdsxDataEnable"
                    >
                      <el-dropdown-item> 绑定监督事项 </el-dropdown-item>
                    </span>
                  </el-dropdown-menu>
                </el-dropdown>
                <span
                  class="tipitem"
                  @click="caseTask(scope.row)"
                  v-show="isLook == 'N'"
                  ><i class="el-icon-document"></i
                  ><b style="padding-left: 5px">外卷导入</b></span
                >

                <span class="tipitem" @click="detail(scope.row)" v-show="false"
                  ><i class="el-icon-search"></i
                  ><b style="padding-left: 5px">阅卷</b></span
                >

                <span
                  class="tipitem"
                  @click="del(scope.row)"
                  v-show="isLook == 'N'"
                  ><i class="el-icon-delete"></i
                  ><b style="padding-left: 5px">删除</b></span
                >
              </template>
            </sp-table-column>
          </sp-table>
        </main>
      </el-tab-pane>
    </el-tabs>
    <Adddialog ref="Adddialog" @updateLIst="updateLIst" />
    <BingCaseDialog ref="BingCaseDialog" @updateLIst="updateLIst" />
  </div>
</template>

<script>
import Adddialog from "./components/AddDialog";
import BingCaseDialog from "./components/BingCaseDialog";
import { parseTime } from "./utils/datechange";
import {
  getCaseList,
  deleteCase,
  CaseProduct,
  getAjly,
  getImportDataSource,
} from "../api/wjgl";
import { Base64 } from "js-base64";
import { parse } from "qs";

export default {
  components: {
    Adddialog,
    BingCaseDialog,
  },
  data() {
    return {
      // 码表值
      ajlbOptions: [],
      ajlyOptions: [],
      zzztOptions: [],
      // 开关判据
      isLook: "N",
      isBand: true,
      // 查询表单
      searchForm: {
        ajmc: "",
        bmsah: "",
        ajly: "",
        cjkssj: "",
        cjjssj: "",
      },
      // 模拟数据
      moduleData: [],
      // 模拟人员信息
      modulePerson: {},
      // 导入与绑定控制判据
      queryAjDataEnable: true,
      queryJdsxDataEnable: true,
    };
  },
  created() {
    // this.getUserInfo();
    // this.$store.commit("user/SET_USER_INFO", {
    //   rybm: "4403000001",
    //   rymc: "111",
    //   dwbm: "440300",
    //   bmbm: "0005",
    // });
    this.getAjlyList();
    this.getImportDataSourceList();
    this.dateData();
  },
  mounted() {
    this.$refs.tabData.query(this.searchForm);
  },
  methods: {
    // 转化时间
    changeTime(val) {
      return parseTime(val, "{y}-{m}-{d}");
    },
    getCaseList,
    // 查询案件
    seccsus() {
      this.$refs.tabData.query(this.searchForm);
    },
    // 刷新案件
    updateLIst() {
      this.$refs.tabData.query(this.searchForm);
    },
    // 日期默认值
    dateData() {
      let start = new Date();
      let end = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.searchForm.cjkssj = parseTime(start, "{y}-{m}-{d}");
      this.searchForm.cjjssj = parseTime(end, "{y}-{m}-{d}");
    },
    // 新增案件
    add() {
      console.log(this.$store.state.user.userInfo, "当前模拟数据");
      this.$refs.Adddialog.open(this.modulePerson);
    },
    // 绑定案件
    bind(val, data) {
      if (val == "tPoint") {
        this.$refs.BingCaseDialog.open(
          { ...this.modulePerson, ajly: "2" },
          "绑定2.0案件"
        );
      } else {
        this.$refs.BingCaseDialog.open(
          { ...this.modulePerson, ajly: "1" },
          "绑定监督事项"
        );
      }
    },
    // 导入监督事项
    biz() {
      this.$refs.BingCaseDialog.open(
        { ...this.modulePerson, ajly: "1" },
        "导入监督事项"
      );
    },
    // 导入2.0案件
    importTP() {
      this.$refs.BingCaseDialog.open(
        { ...this.modulePerson, ajly: "2" },
        "导入2.0案件"
      );
    },
    // 清空查询条件
    clearForm() {
      this.searchForm.ajmc = "";
      this.searchForm.bmsah = "";
      this.searchForm.ajly = "";
      this.modulePerson.id = "";
      this.isBand = true;
      this.dateData();
      this.seccsus();
    },
    // 卷宗制作
    async caseTask(row) {
      await CaseProduct({ ...this.modulePerson, id: row.id }).then((res) => {
        if (res.code == 0) {
          // this.$router.push({
          //   name: "module",
          //   query: {
          //     id: row.id,
          //     ajmc: row.ajmc,
          //   },
          // });
          sessionStorage.setItem("readOnly", false);
          let strii = Encrypt(
            JSON.stringify({
              dwbm: this.$store.state.user.userInfo.dwbm,
              rybm: this.$store.state.user.userInfo.rybm,
              rymc: this.$store.state.user.userInfo.rymc,
            })
          );
          const { href } = this.$router.resolve({
            name: "module",
            query: { info: strii, id: row.id, ajmc: row.ajmc },
          });
          window.open(href, "_blank");
        } else {
          this.$message.error("跳转错误");
        }
      });
    },
    // 检书阅卷(加密网址数据并跳转)
    detail(row) {
      let strUrl = "http://143.146.56.142:8095/";
      // let strUrl = "http://143.146.57.154:8095/"; // uat上线测试环境
      // 模拟加密数据测试
      let ajxx = {};
      ajxx.ajlbb = row.ajlbb;
      ajxx.ajmc = row.ajmc;
      ajxx.batdbm = row.batdbm;
      ajxx.bmsah = row.bmsah;
      ajxx.cbdwbm = row.cbdwbm;
      ajxx.lclsbh = row.lclsbh;
      ajxx.tysah = row.tysah;
      ajxx.ywbm = row.ywbm;
      let yhxx = {};
      yhxx.ryxm = this.$store.state.user.userInfo.rymc;
      yhxx.rybm = this.$store.state.user.userInfo.rybm;
      yhxx.dlrdwbm = this.$store.state.user.userInfo.dwbm;
      yhxx.bmbm = this.$store.state.user.userInfo.bmbm;
      //  Base64.encode(name)
      let detailArr = [];
      detailArr.push(
        "ajxx" + "=" + Base64.encode(encodeURIComponent(JSON.stringify(ajxx)))
      );
      detailArr.push(
        "yhxx" + "=" + Base64.encode(encodeURIComponent(JSON.stringify(yhxx)))
      );
      let dataObj = detailArr.join("&");
      console.log("处理后数据", Encrypt(dataObj));
      let newUrl = strUrl + "?" + Encrypt(dataObj);

      window.open(newUrl);

      //--------------------分割线
      // let newData = Encrypt(JSON.stringify(row));
      // let urlstr =
      //   "97a63ae1b7b274dff110be6118a4bc8bd72d4eeca1f42913f46b7d59dfc6a0f4a5f0b5ca75f362cec584507e55801e6f11ae37a96fbd32e842d6bfefa41795bf8ac50f7f0738a06d2522cf6be5d988403255d39409f16cd7eac14af2fed3a5dbb7d0cafceb34073efe2568bd740af7eb02d915c6b1b492c13953cf0578b90834896b55d29be5c8fcb8db597a01ae0db913f215150041e652db18d0a2d1c799d6806c6ab95ea502bef8253b3d7a4eeed9193632851b012fd8f72e103ecd61cc3405ce64ff50a354591ef82ad9c298279721f769ab4e7d0c8f638a2dd225ee331b8f49abbd96bc2f65fd297f55de83ad9d25a5975f9dfff94d603eea198b46c4e24ab29887c68805da3b4328d58ee36b8dc60311b28883270b18bc82ab6aeb7202fe4a09afcdf416b1086fe8b751d07375c07e2ebb7b436bd3e7e53f7ddcbd79ecce24d6aad702830bc33c6644034a00008ea8a49a5a3d0fec87380b7cc89dae786316c0bc74579b127295b4173648a08f2156d095695a39ab4ed42e9215cfa6c354c27dd77d3156b3d8f6275c893ca81f2200d481ecca3b8462bfc090bf931b8f3953789feea603d92d9bdfcb4e11459067a44fdbd722f79a61a778e7fcdf645dfc0b4c4f349caeda9af4df5770fbd5d61eec3669492aad1a8e5dddad1a4fe8a754aa9abe337c7dd3141245a366578e8821293430dac91d0a78e9f2eb8c84893485e25ca4501f392b9c5e55ab6ad53aa743616ee89df0bb835d3dc54ac11902029526ded349e9c50c142b83299d8a1e22c5c87e2ec370d7aced6765e98f92f47e717de8dfce309617f986923f03a6f6dbf428e24d66d5163dae3546ed7c23054c3e7013a0e36b5ea942054cf5b800cc5388ac9cd5d07c9c754d3e35a896a515270545cd248078d5538fdad8c625a1fabb7b8e125cd573e1b8b3ec0caf4046b2168b699cdb787104a69f28a990321d2434b5575222210b5eaa090ff0e5bf01acafa51ead051bdd7ed829f08bf408d9669ebdc08d4ef426d0ed5bb0edc623e83e93187361586cd52c5de202d97deedecd032975b3";
      // console.log(row, newData, "行数据");
      // // 第一二层解密
      // let decodeData = Decrypt(urlstr).split("&");
      // let newCodeData = new Object();
      // // 第三层解密
      // for (var i = 0; i < decodeData.length; i++) {
      //   newCodeData[decodeData[i].split("=")[0]] = decodeData[i].split("=")[1];
      // }
      // // 第四层解密
      // let ajxxInfo = JSON.parse(
      //   decodeURIComponent(Base64.decode(newCodeData.ajxx))
      // );
      // let yhxxInfo = JSON.parse(
      //   decodeURIComponent(Base64.decode(newCodeData.yhxx))
      // );
      // console.log(
      //   JSON.parse(Decrypt(newData)),
      //   decodeData,
      //   newCodeData,
      //   ajxxInfo,
      //   yhxxInfo,
      //   "解密数据"
      // );
    },
    // 删除
    del(row) {
      this.$confirm("删除后无法找回，确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { code, msg } = await deleteCase({
            id: row.id,
            rybm: this.modulePerson.rybm,
            rymc: this.modulePerson.rymc,
          });
          if (code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          this.$refs.tabData.query(this.searchForm);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 行点击
    tableClick(row) {
      if (row.id) {
        this.modulePerson.id = row.id;
        this.isBand = false;
      } else {
        this.isBand = true;
      }
    },

    // 获取案件来源
    async getAjlyList() {
      let res = await getAjly();
      if (res.code == 0) {
        this.ajlyOptions = res.data;
        this.$refs.BingCaseDialog.ajlyOptions = res.data;
        // console.log(res.data, "获取案件来源的数据");
      } else {
        console.log("error");
      }
    },
    // 获取导入案件接口状态
    async getImportDataSourceList() {
      let res = await getImportDataSource();
      if (res.code == 0) {
        // console.log(res.data, "导入接口状态");
        if (res.data.queryAjDataEnable == 1) {
          this.queryAjDataEnable = true;
        } else {
          this.queryAjDataEnable = false;
        }
        if (res.data.queryJdsxDataEnable == 1) {
          this.queryJdsxDataEnable = true;
        } else {
          this.queryJdsxDataEnable = false;
        }
      } else {
        console.log("error");
      }
    },
    // 获取页面登陆信息
    getUserInfo() {
      let urlstr = window.location.href;
      // console.log(urlstr.indexOf("?"), "查询");
      if (urlstr.indexOf("?") == -1) {
        this.$store.commit("user/SET_USER_INFO", {
          rybm: "4403000001",
          rymc: "111",
          dwbm: "440300",
          userToken: "4ef1b9c5b22e4ff38f938c0b47ba0bae",
        });
      } else {
        // 第一二层解密
        urlstr = urlstr.substring(urlstr.indexOf("?") + 1);
        // console.log(urlstr, "地址");
        let decodeData = Decrypt(urlstr).split("&");
        // console.log(decodeData, "解密后数据");
        let newCodeData = new Object();
        // 第三层解密
        for (var i = 0; i < decodeData.length; i++) {
          newCodeData[decodeData[i].split("=")[0]] = decodeData[i].split(
            "="
          )[1];
        }
        // 第四层解密
        // let ajxxInfo = JSON.parse(
        //   decodeURIComponent(Base64.decode(newCodeData.ajxx))
        // );
        let yhxxInfo = JSON.parse(
          decodeURIComponent(Base64.decode(newCodeData.yhxx))
        );
        this.$store.commit("user/SET_USER_INFO", {
          rybm: yhxxInfo.rybm,
          rymc: yhxxInfo.rymc,
          dwbm: yhxxInfo.dwbm,
          userToken: yhxxInfo.userToken,
          thirdId: yhxxInfo.thirdId,
        });
      }

      this.searchForm = {
        ...this.searchForm,
        ...this.$store.state.user.userInfo,
      };

      this.modulePerson = this.$store.state.user.userInfo;
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
.wjgl-home {
  height: 100%;
  box-sizing: border-box;
}
/deep/.is-disabled {
  color: #c0c4cc !important;
  border-color: #ebeef5 !important;
}
/deep/.el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}
/deep/.el-tabs--border-card > .el-tabs__header {
  background-color: #d7e5f9;
}
/deep/.is-active {
  font-size: 16px;
}
/deep/.el-button--small {
  border-color: #1b9cff;
  color: #1b9cff;
}
/deep/.el-button--primary {
  color: #fff;
}
.tipitem {
  cursor: pointer;
  margin-right: 10px;
  > i {
    font-size: 14px;
    color: rgb(126, 203, 226);
  }
  > b {
    color: #4b8ffa;
    font-size: 14px;
    font-weight: normal;
  }
}
/deep/.el-table__row {
  cursor: pointer;
}
.tooltopBox {
  display: inline-block;
  margin: 0px 10px;
}
// /deep/.current-row > td.el-table__cell {
//   background-color: #68a9db !important;
// }
</style>  