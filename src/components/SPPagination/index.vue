<template>
  <div class="sp-pagination">
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      :current-page="currentPage"
    >
      <slot>
        <div class="page-size">每页10条</div>
      </slot>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "SP-pagination",
  data() {
    return {
      pageSize: 10,
    };
  },
  props: {
    pageSize: {
      type: Array,
      default: () => [10, 15, 20],
    },
    total: {
      type: Number,
      require: true,
    },
    layout: {
      type: String,
      default: "total,slot,prev,pager,next,jumper",
    },
    currentPage: {
      type: Number,
    },
  },
  methods: {
    sizeChange(val) {
      this.pageSize = val;
      this.$emit("size-change", val);
    },
    currentChange(val) {
      this.$emit("current-change", val);
    },
  },
};
</script>

<style lang="less" scoped>
.sp-pagination {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  height: 72px;
  align-items: center;
  padding-right: 20px;
  /deep/.el-pagination__total {
    font-size: 14px;
  }
}
.page-size {
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666;
  letter-spacing: 0;
  line-height: 14px;
  font-weight: normal;
  margin: 6px 5px 0 22px;
}
</style>