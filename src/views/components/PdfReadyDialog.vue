<template>
  <SP-dialog
    :title="title"
    :visible.sync="visible"
    @cancel="visible = false"
    @confirm="confirm"
    @close="handleClose"
    :width="'600px'"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      size="medium"
    >
      <el-form-item
        label="请输入pdf阅读密码"
        prop="yzmm"
        style="margin-bottom: 30px"
      >
        <el-input
          style="width: 250px"
          v-model="ruleForm.yzmm"
          placeholder="请输入pdf阅读密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <p class="tooltip">当前文件需要输入pdf阅读密码</p>
  </SP-dialog>
</template>

<script>
import { pdfReady, Wjprocess, postWjtj,getMaxWjsxh } from "../api/wjgl";
export default {
  props: {},
  data() {
    return {
      visible: false,
      title: "",
      ruleForm: {
        dwbm: "",
        identifier: "",
        yzmm: "",
      },
      pdfId: "",
      rymc: "",
      rybm: "",
      mlbh: "",
      jzbh: "",
      wjxh: "",
      importType: "",
      formData: {},
      rules: {
        yzmm: [
          { required: true, message: "请输入pdf阅读密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 弹窗打开
    open(val, formData) {
      this.pdfId = val;
      this.formData = formData;
      //   console.log(val, formData, "组件参数");
      // this.title = val.name;
      // this.ruleForm.dwbm = formData.dwbm;
      // this.ruleForm.identifier = formData.identifier;
      // this.rymc = formData.rymc;
      // this.rybm = formData.rybm;
      // this.mlbh = formData.mlbh;
      // this.jzbh = formData.jzbh;
      // this.importType = formData.importType;
      this.visible = true;
    },
    // 关闭弹窗
    handleClose() {
      this.ruleForm.yzmm = "";
      this.visible = false;
    },
    // 确认点击
    async confirm() {
      let resp = await pdfReady({
        id: this.pdfId,
        pdfmm: this.ruleForm.yzmm,
      });
      if (resp.data) {
        this.visible = false;
        this.wjReady();
      } else {
        this.visible = true;
        this.$message.error("密码错误，请重新输入");
      }
    },
    // 上传文件验证
    async wjReady() {
      let res = await postWjtj({
        id: this.pdfId,
        jzbh: this.formData.jzbh,
        mlbh: this.formData.mlbh,
        wjsxh: this.formData.wjsxh,
        tjlx:this.formData.tjlx,
        jbh:this.formData.jbh,
        wjxh:this.formData.wjxh
      });
      if (res.code == 0) {
        this.visible = false;
        this.$message.success('文件上传成功');
        this.$emit("updataFileList");
      } else {
        this.$message.error('文件上传失败');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tooltip {
  padding-right: 20px;
  color: #aaaaaa;
  text-align: right;
}
</style>