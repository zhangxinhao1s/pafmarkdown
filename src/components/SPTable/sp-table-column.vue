<template>
  <el-table-column
    :type="type"
    :label="label"
    :class-name="'ft-table-column ' + (className || '')"
    :label-class-name="labelClassName"
    :property="property"
    :prop="prop"
    :width="width"
    :min-width="minWidth"
    :render-header="renderHeader"
    :sortable="sortable"
    :sort-method="sortMethod"
    :sort-by="sortBy"
    :resizable="resizable"
    :column-key="columnKey"
    :align="align"
    :header-align="headerAlign"
    :show-overflow-tooltip="showOverflowTooltip"
    :fixed="fixed"
    :formatter="formatter"
    :selectable="selectable"
    :reserve-selection="reserveSelection"
    :filter-method="filterMethod"
    :filtered-value="filteredValue"
    :filters="filters"
    :filter-placement="filterPlacement"
    :filter-multiple="filterMultiple"
    :index="index"
    :sort-orders="sortOrders"
  >
    <slot slot="header" name="header"></slot>
    <slot
      slot-scope="scope"
      :row="scope.row"
      :$index="scope.$index"
      :column="scope.column"
      :store="scope.store"
      :_self="scope._self"
    >
      <template>{{
        valueFormatter(scope.row, scope.column, scope.row[prop], scope.$index)
      }}</template>
    </slot>
  </el-table-column>
</template>
<script>
export default {
  name: "sp-table-column",
  props: {
    //element的参数，以下
    type: {
      type: String,
      default: "default",
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: String,
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false,
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true,
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    // showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true,
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default() {
        return ["ascending", "descending", null];
      },
      validator(val) {
        return val.every(
          (order) => ["ascending", "descending", null].indexOf(order) > -1
        );
      },
    },
    //element的参数，以上
    //新增参数,以下
    isFormatter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    valueFormatter(row, column, cellValue, index) {
    
      if (this.formatter) {
        return this.formatter;
      }
      if (!this.isFormatter) {
        return cellValue;
      }
      if (cellValue || cellValue === 0) {
        return cellValue
          .toString()
          .replace("0.00%", "0%")
          .replace("0.0%", "0%");
      } else {
        return "-";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-table th.sc-table-column > .cell {
  display: flex;
  align-items: center;
  text-align: justify;
}
.el-table .cell {
  white-space: nowrap;
}
</style>