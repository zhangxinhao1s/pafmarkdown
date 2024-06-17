<template>
  <div class="sp-pagination" v-show="total > 0">
    <el-pagination
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :page-size="pageSize"
      :layout="layout"
      prev-text="上一页"
      next-text="下一页"
      :current-page="currentPage"
      :page-sizes="pageSizes"
    >
      <span class="talbox">
        <span class="texttal"> 总共&nbsp;{{ total }}&nbsp;条</span>
        <span class="numberfo" v-if="!sizes">
          每页
          <el-select v-model="pageSize">
            <el-option
              v-for="(itemm, index) in pageSizes"
              :key="index"
              :label="item"
              :value="item"
            ></el-option
            >条
          </el-select>
        </span>
      </span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "sp-pagination",
  props: {
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50],
    },
    sizes: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 100,
      require: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    layout: {
      type: String,
      default: "total,slot,prev,pager,next,jumper",
    },
    currentPage: {
      type: Number,
      default: 10,
    },
  },
  watch: {
    pageSize(newName) {
      this.$emit("size-change", newName);
      if (this.total <= newName && this.currentPage !== 1) {
        setTimeout(() => {
          this.$emit("current-change", 1);
        }, 400);
      }
    },
  },
  methods: {
    currentChange(val) {
      this.$emit("current-chage", val);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-pagination .el-select .el-input .el-input__inner {
  height: 28px;
}
.sp-pagination {
  display: flex;
  width: 10px;
  justify-content: flex-end;
  align-items: center;
  /deep/.el-pagination__total {
    font-size: 14px;
  }
  /deep/.btn-prev,
  /deep/ .btn-next {
    padding-left: 5px;
    padding-right: 5px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;
  }
  /deep/.el-pager li {
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;
    font-weight: 100;
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
.talbox {
  .texttal {
    font-weight: 100;
    margin-right: 10px;
  }
  .numberfo {
    font-weight: 100;
    margin-right: 10px;
    /deep/.el-inpirt__inner {
      height: 28px;
      border-radius: 4px;
    }
    /deep/.el-input__icon {
      line-height: 28px;
    }
    /deep/.el-input {
      width: 60px;
      margin: 0;
    }
  }
}
</style>