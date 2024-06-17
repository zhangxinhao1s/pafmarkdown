<template>
  <div class="top-title">
    <div class="left-box">
      <img src="@/assets/icons/juanzong.png" alt="" />
      <span>{{ title }}</span>
    </div>
    <div>
      <el-button type="primary" class="btn">同步任务</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
  },
};
</script>

<style lang="less" scoped>
.top-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #d7d7d7;
  .left-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
      opacity: 0.7;
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0.59px;
      font-weight: 600;
      margin-left: 13px;
    }
  }
  .btn {
    width: 140px;
    height: 40px;
    background: #096dd9;
    border-radius: 4px;
    border: 0px;
  }
}
</style>