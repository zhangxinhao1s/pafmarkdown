<template>
  <div class="sp-table-container">
    <el-table
      :data="resultData"
      stripe
      border
      style="width: 100%"
      header-cell-class-name="sp-table-header"
      v-loading="loading"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      v-bind="$attrs"
    >
      <!-- 修改当表格没有数据时的默认提示图案 -->
      <template slot="empty">
        <div>
          <img class="imgbox" src="@/assets/icons/common/空数据.png" />
        </div>
      </template>

      <el-table-column
        type="selection"
        v-if="isShowSelection"
        width="50"
        align="center"
      ></el-table-column>

      <el-table-column
        v-if="isShowIndex"
        type="index"
        :index="getIndex"
        label="序号"
        width="80"
      >
      </el-table-column>
      <slot></slot>
    </el-table>
    <div v-show="isShowPagination" class="footer-pagination">
      <el-pagination
        :style="paginationStyle || 'text-align: right'"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pageSize="queryParams.pageSize"
        :current-page.sync="queryParams.pageNum"
        @current-change="onCurrentPageChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "sp-table",
  props: {
    paginationStyle: String,
    tableData: {
      //如果只是展示静态数据，无需调接口获取
      type: Array,
      default: () => {
        return [];
      },
    },
    queryFunction: {
      //请求后台接口的方法
      type: Function,
      default: null,
    },
    isShowSelection: {
      //是否显示复选框
      type: Boolean,
      default: false,
    },
    isShowIndex: {
      //是否显示索引
      type: Boolean,
      default: true,
    },
    //是否显示分页条
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    defaultOrderBy: {
      //根据哪个字段排序
      type: String,
      default: "",
    },
    defaultOrderType: {
      //升序或者降序
      type: String,
      default: "",
    },
  },
  computed: {
    resultData() {
      //优先外部的静态数据，否则取接口的数据
      return this.tableData.length > 0 ? this.tableData : this.showData;
    },
  },
  data() {
    return {
      showData: [],
      total: 0,
      loading: false,
      queryParams: {
        pageSize: 10,
        pageNum: 1,
      },
      queryCallBack: null,
      // pageNum: 1,
      // pageSize: 10,
      orderBy: "",
      orderType: "",
    };
  },
  created() {
    if (this.defaultOrderBy && this.defaultOrderType) {
      this.orderType = this.defaultOrderType;
      this.orderBy = this.defaultOrderBy;
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("selectList", val);
    },
    query(queryParams = {}, queryCallBack = null) {
      // console.log(queryParams);
      // this.pageNum = 1
      this.queryParams.pageNum = 1;
      this.queryParams = {
        ...this.queryParams,
        ...queryParams,
      };
      this.doQuery();
      if (queryCallBack) {
        this.queryCallBack = queryCallBack;
      }
    },
    getIndex(index) {
      return index + 1;
    },
    doQuery() {
      this.loading = true;
      const totalParams = { ...this.queryParams };
      // if (totalParams.pageSize) {
      //   //如果外部指定了分页参数
      //   this.pageSize = totalParams.pageSize;
      //   if (totalParams.pageNum) {
      //     this.pageNum = totalParams.pageNum;
      //   } else {
      //     totalParams.pageNum = this.pageNum;
      //   }
      // } else {
      //   if (this.isShowPagination) {
      //     totalParams.pageNum = this.pageNum;
      //     totalParams.pageSize = this.pageSize;
      //   }
      // }

      if (this.orderBy && this.orderType) {
        totalParams.orderBy = this.orderBy;
        totalParams.orderType = this.orderType;
      }
      this.queryFunction(totalParams)
        .then((result) => {
          this.loading = false;
          if (result && result.data) {
            this.showData = result.data.records;
            this.total = result.data.total;
            if (this.queryCallBack) {
              this.queryCallBack(result);
            }
          }
        })
        .catch((e) => {
          this.loading = false;
          console.log("error:", e);
        });
    },
    onCurrentPageChange(pageNum) {
      this.queryParams.pageNum = pageNum;
      this.doQuery();
    },

    getOrderType(order) {
      if (order === "ascending") {
        return "asc";
      } else if (order === "descending") {
        return "desc";
      }
      return order;
    },
    handleSortChange(orderInfo) {
      console.log("orderInfo===", orderInfo);
      this.orderBy = orderInfo.prop;
      this.orderType = this.getOrderType(orderInfo.order);
      this.$emit("sort-change", this.orderBy, this.orderType);
      this.doQuery();
    },
    handleRowClick(row) {
      this.$emit("rowClick", row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryParams.pageSize = val;
      this.doQuery();
    },
    // setShowData(data){
    //   this.showData = data
    // }
  },
};
</script>
<style lang="less" scoped>
.sp-table-container {
  margin-top: 16px;

  .footer-pagination {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: normal;
    .el-pagination {
      padding: 0px;
    }
  }
}

.imgbox {
  height: 100%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

//  .el-table th.el-table__cell {
//   background-color: #EAEDF3;
//   color: #333333;
//   border-bottom: 1px solid #D9D9D9;
// }
// /deep/ .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
//     border-bottom: 1px solid #D9D9D9;
// }
// .el-table th > .cell{
//     height: 36px;
//     line-height: 36px;
// }
// /deep/ .el-table .caret-wrapper {
//   margin-bottom: 1px;
// }
// .sp-table-header{
//   height: 54px;
//   background-color:#ff8255;
//   color:#606266;
//   font-size:14px;
// }
</style>