<template>
  <div class="wpsBox">
    <div class="wpsButBox">
      <el-button type="primary" v-if="wpsObj.isTree" @click="wps_close" size="mini">关闭</el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="loading"
        v-if="wpsObj.isSave"
        @click="loadSmgxmlModels"
      >保存</el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="loading"
        v-if="wpsObj.isList"
        @click="getVersions"
      >历史版本</el-button>
    </div>

    <div class="cloud-content">
      <iframe
        :key="timer"
        v-if="wpsVisible"
        id="iframe"
        ref="iframeDom"
        name="iframe"
        scrolling="no"
        style="border: 0"
        width="100%"
        height="100%"
        :src="iframeSrc"
        @load="sendMessage"
      ></iframe>
    </div>
    <SP-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :title="'历史版本'"
      class="listDialog"
      :visible.sync="visible"
      :show-close="false"
      width="650px"
      :before-close="close"
      @cancel="close"
      @confirm="close"
    >
      <sp-table ref="appSpTable" :tableData="tableData" :isShowPagination="false">
        <sp-table-column prop="docFileName" label="文书名称" show-overflow-tooltip></sp-table-column>
        <sp-table-column prop="createdName" label="更新人" show-overflow-tooltip></sp-table-column>
        <sp-table-column prop="createdAt" label="更新时间" show-overflow-tooltip></sp-table-column>
        <sp-table-column prop="versionNo" label="版本号" show-overflow-tooltip></sp-table-column>

        <sp-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-action" @click="getRollback(scope.row)">回滚</span>
          </template>
        </sp-table-column>
      </sp-table>
    </SP-dialog>
  </div>
</template>

<script>
import { getFileToken } from "@/views/common/api/user";
// 暂不需要
import { docVersionList, docVersionRollback } from "@/views/common/api/clue";
import storage from "@/utils/storage/storage";
export default {
  props: {
    wpsObj: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    wpsObj: {
      deep: true,
      handler(newV) {
        console.log("newV", newV);
        this.timer = new Date().getTime();
      }
    }
  },
  data() {
    const base = process.env.NODE_ENV ===  'development' ? '/' : '/gzw/';
    return {
      wpsVisible: true,
      timer: "",
      //iframe 嵌套的html页面地址
      iframeSrc: `${base}wps_demo/index.html`,
      loading: false,
      tableData: [],
      visible: false
    };
  },
  mounted() {
    this.$store.state.loading.fullscreenLoading = true;
    setTimeout(() => {
      this.$store.state.loading.fullscreenLoading = false;
    }, 300);
  },
  methods: {
    //回滚
    getRollback(row) {
      this.$store.state.loading.fullscreenLoading = true;
      this.$confirm("是否确认回滚到该版本？", "提示", {
        confirmButtonText: "确认",
        concelButtonText: "取消",
        type: "waring"
      })
        .then(async () => {
          const { code, data, msg } = await docVersionRollback({
            docFileId: this.wpsObj.taskBizId,
            docHistoryFileId: row.docFileId
          });
          if (code == 0) {
            this.$store.state.loading.fullscreenLoading = false;
            this.$message.success(msg);
            this.close();
            this.$emit("upData");
          } else {
            this.$store.state.loading.fullscreenLoading = false;
            console.log(msg);
          }
        })
        .catch(() => {
          this.$message("已取消");
        });
    },
    // 确认保存
    loadSmgxmlModels() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
      getFileToken().then(e => {
        //this.templateType='ZBRWLX_WS;
        const { fileToken } = e.data;
        // console.log(fileToken);
        let uploadURL = this.wpsObj.uploadURL + "&fileToken=" + fileToken;
        // console.log(uploadURL);
        //触发iframe内html文件中的事件
        const flag = iframe.window.saveFileForSever(fileToken, uploadURL);
        if (flag) {
          // console.log("上传成功");
          this.$emit("upData");
          this.$message.success("保存成功！");
        } else {
          // console.log("上传失败！");
          this.$message.error("保存失败！");
        }
      });
    },
    // 获取历史列表
    async getVersions() {
      this.wpsVisible = false;
      this.visible = true;
      this.$store.state.loading.fullscreenLoading = true;
      const { code, data, msg } = await docVersionList({
        docFileId: this.wpsObj.taskBizId
      });
      if (code == 0) {
        this.tableData = data;
      } else {
        this.$store.state.loading.fullscreenLoading = false;
        console.log(msg);
      }
    },
    //关闭
    wps_close() {
      this.$emit("closeWps");
    },
    sendMessage() {
      //每次刷新页面都要重新下载fileToken
      getFileToken().then(res => {
        const obj = {
          ...this.wpsObj,
          fileToken: res.data.fileToken
        };
        // console.log('传入wpsiframe的内容',obj);
        const iframeWindow = document.querySelector("#iframe").contentWindow;
        iframeWindow.postMessage(obj, "*"); //发消息至html页面
      });
    },
    close() {
      this.visible = false;
      this.tableData = [];
      this.wpsVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.wpsBox {
  width: 100%;
  height: 100%;
  .wpsButBox {
    height: 30px;
    button {
      float: right;
      margin: 2px 5px 0px 15px;
    }
  }
  .cloud-content {
    height: calc(100% - 30px);
  }
}
/deep/.el-dialog__body {
  padding: 24px;
  height: 50vh;
  overflow: scroll;
}
</style>