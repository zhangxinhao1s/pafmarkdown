<template>
  <div class="table-container">
    <!-- <div class="table-row" v-for="(item,index) in tableData.slice(0,tableData.length%2==0?tableData.length/2:tableData.length/2 + 1)" :key="index">
      <label :style="'width:'+labelWidth">{{tableData[index*2].label}}</label>
      <span :style="'width: calc(50% - '+ labelWidth + ')'">{{tableData[index*2].value}}</span>
      <label :style="'width:'+labelWidth">{{tableData[index*2+1]?tableData[index*2+1].label || '':''}}</label>
      <span :style="'width: calc(50% - '+ labelWidth + ')'">{{tableData[index*2+1]?tableData[index*2+1].value|| '':''}}</span>
    </div> -->
    <section v-for="(item,index) in calcData" :style="'width:' + 100/columnNum + '%'" :key="index">
      <label class="text-over" :style="'width:'+labelWidth">{{calcData[index].label}}</label>
      <span class="text-over">{{calcData[index].value}}</span>
    </section>
  </div>
</template>
<script>
export default {
  name: "SPStaticTable",
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    labelWidth: {
      type: String,
      default: "120px",
    },
    columnNum: {
      default: 2,
    },
  },
  computed: {
    calcData() {
      if (this.tableData.length == 0) {
        return [];
      }
      let mergeData = [].concat(this.tableData)
      const diffNum = mergeData.length % this.columnNum; //按列排，最后一行能不能占满
      if (diffNum) {
        for (let i = 0; i < this.columnNum - diffNum; i++) {
          //还差几个，给它补满
          mergeData.push({ label: "", value: "" });
        }
      }
      return mergeData;
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.table-container {
  background: #fff;
  border-top: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;

  // .table-row {
  //   display: flex;
  //   height: 48px;
  //   color: #333333;
  //   line-height: 48px;
  //   label {
  //     text-align: right;
  //     border-right: 1px solid #d9d9d9;
  //     border-bottom: 1px solid #d9d9d9;
  //     padding: 0px 16px;
  //   }
  //   span {
  //     color: #666666;
  //     border-right: 1px solid #d9d9d9;
  //     border-bottom: 1px solid #d9d9d9;
  //     padding: 0px 16px;
  //   }
  // }

  section {
    display: flex;
    height: 48px;
    font-size: 14px;
    color: #222222;
    line-height: 48px;
    label {
      text-align: right;
      border-right: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      padding: 0px 16px;
    }
    span {
      flex: 1;
      color: #666666;
      border-right: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      padding: 0px 16px;
    }
  }
}
</style>
