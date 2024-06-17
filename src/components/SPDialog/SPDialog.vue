<template>
  <el-dialog
    :width="width"
    :title="title"
    v-bind="$attrs"
    v-on="$listeners"
    :close-on-click-modal="false"
    :append-to-body="true"
    :modal-append-to-body="false"
    :before-close="handleClose"
    ref="dialog"
  >
    <!-- <el-divider></el-divider> -->
    <slot></slot>
    <!-- <el-divider v-if="isshow"></el-divider> -->
    <div
      slot="footer"
      class="dialog-footer"
      :style="{ 'justify-content': btnToCenter ? 'center' : 'flex-end' }"
      v-if="isBtn"
    >
      <div>
        <el-button size="small" class="btn1" @click="$emit('cancel')"
          >取消</el-button
        >
        <el-button
          size="small"
          class="btn2"
          @click="$emit('confirm')"
          type="primary"
          >{{ confirm }}</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SPDialog",
  props: {
    // visible: {
    //   type: Boolean,
    //   default: false,
    // },
    width: {
      type: String,
      default: "500px",
    },
    title: {
      type: String,
      default: "",
    },
    confirm: {
      type: String,
      default: "确定",
    },
    isBtn: {
      type: Boolean,
      default: true,
    },
    btnToCenter: {
      //按钮是否居中显示
      type: Boolean,
      default: false,
    },
    // isshow: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  methods: {
    handleClose() {
      console.log("关闭");
      // this.$refs.dialog.visibel = false;
      // done();
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="less" scoped>
.btn1 {
  background: #f6f8fb;
  border: 1px solid rgba(9, 109, 217, 1);
  border-radius: 8px;
  width: 80px;
  height: 38px;
}
.btn2 {
  background: #096DD9;
 border-radius: 8px;
  width: 80px;
  height: 38px;
}
.el-dialog__header {
  padding: 24px 32px 0 24px;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  .el-dialog__headerbtn {
    right: 32px;
  }
}
/deep/.el-dialog__body {
  padding: 20px;
}
/deep/.el-divider--horizontal {
  margin: 0;
  margin-bottom: 20px;
}
.el-dialog__footer {
  padding: 0px 56px 32px 0px;
}
/deep/.el-input__inner {
  // width: 280px;
}
/deep/.el-form {
  padding: 0 20px;
}
/deep/ .el-button + .el-button {
  margin-left: 12px;
}
.dialog-footer {
  display: flex;
  align-items: center;
  // justify-content: flex-end;
}
/deep/.el-dialog__title {
  border-left: 4px #096dd9 solid;
  padding-left: 12px;
}
</style>