<template>
  <div class="select-box">
    <el-select
      v-model="selectValue"
      multiple
      :placeholder="placeholder"
      :filterable="filterable"
      :filter-method="dataFilter"
      :popper-append-to-body="appendToBody"
      @remove-tag="removeTag"
      @clear="clearAll"
      :clearable="isCanDelete"
      style="width: 94%"
      :disabled="disabledSelect"
      collapse-tags
    >
      <div class="input-select">
        <el-input
          placeholder="请输入搜索关键词"
          prefix-icon="el-icon-search"
          v-model="selectInput"
          @input="dataFilter"
        ></el-input>
        <!-- <div class="check-box">
          <el-button type="text" @click="handlecheckAll">全选</el-button>
          <el-button type="text" @click="handleReset">清空</el-button>
        </div> -->
      </div>
      <el-option :value="selectTree" class="option-style" disabled>
        <el-tree
          :data="options"
          :props="defaultProps"
          class="tree-style"
          ref="treeNode"
          :show-checkbox="true"
          :node-key="defaultProps.value"
          :filter-node-method="filterNode"
          :default-checked-keys="defaultValue"
          :check-strictly="checkStrictly"
          @check-change="handleNodeChange"
        >
        </el-tree>
      </el-option>
    </el-select>
  </div>
</template>
  
  <script>
export default {
  name: "TreeSelect",
  props: {
    //编辑时回显的数组
    defaultValue: {
      type: Array,
      // default: () => [],
    },
    //可用选项的数组
    options: {
      type: Array,
      // default: () => [],
    },
    checkFlag: {
      type: Boolean,
      default: true, // 不可以多选
    },
    // 配置选项
    defaultProps: {
      type: Object,
      default: () => ({
        // 属性值为后端返回的对应的字段名
        children: "children",
        label: "label",
        value: "value",
      }),
    },
    // 是否将组件添加到body上面(组件在弹窗或者表格里面时可设为true)
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: true, // 不可以搜索
    },
    // 是否禁用下拉框
    disabledSelect: {
      type: Boolean,
      default: false,
    },
    // 父子不互相关联
    checkStrictly: {
      type: Boolean,
      default: false, // 关联
    },
    // 父类id字段名 (如果父子联动则必传该字段,不联动则不用传)
    parentValue: {
      type: String,
      default: "parentValue",
    },
    // 回显的值是否可被删除 true: 可以删除；false：不能删除
    isCanDelete: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    // 不可删除报错
    errMessage: {
      type: String,
      default: "该选项不可被删除",
    },
  },
  data() {
    return {
      selectTree: [], // 绑定el-option的值
      selectValue: [], // 文本框中的标签
      VALUE_NAME: this.defaultProps.value, // value转换后的字段
      VALUE_TEXT: this.defaultProps.label, // label转换后的字段
      treeLoading: false, // 加载loading~
      selectInput: "",
    };
  },
  watch: {
    // 监听回显的数据
    defaultValue: {
      handler(newValue, oldValue) {
        if (newValue.length) {
          this.$nextTick(() => {
            let datalist = this.$refs.treeNode.getCheckedNodes();
            if (!this.checkStrictly) {
              const parentList = datalist
                .filter((v) => v[this.defaultProps.children])
                .map((v) => v[this.VALUE_NAME]);
              datalist = datalist.filter(
                (v) => parentList.indexOf(v[this.parentValue]) === -1
              );
            }
            this.selectTree = datalist;
            this.selectValue = datalist.map((v) => v[this.VALUE_TEXT]);
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 全选
    handlecheckAll() {
      // this.treeLoading = true
      this.$refs.treeNode.setCheckedNodes(this.options);
      // setTimeout(() => {
      //   this.$refs.treeNode.setCheckedNodes(this.options)
      //   this.treeLoading = false
      // },200)
    },
    // 清空
    handleReset() {
      if (this.isCanDelete) {
        // this.treeLoading = true
        setTimeout(() => {
          this.$refs.treeNode.setCheckedNodes([]);
          // this.treeLoading = false
        }, 200);
      } else {
        this.$message.error(this.errMessage);
      }
    },
    /**
     * @description: 反选处理方法
     * @param {*} nodes 整个tree的数据
     * @param {*} refs  this.$refs.treeNode
     * @param {*} flag  选中状态
     * @param {*} seleteds 当前选中的节点
     * @return {*}
     */
    batchSelect(nodes, refs, flag, seleteds) {
      if (Array.isArray(nodes)) {
        nodes.forEach((element) => {
          refs.setChecked(element, flag, true);
        });
      }
      if (Array.isArray(seleteds)) {
        seleteds.forEach((node) => {
          refs.setChecked(node, !flag, true);
        });
      }
    },
    // 反选
    handleReverseCheck() {
      if (this.isCanDelete) {
        this.treeLoading = true;
        setTimeout(() => {
          let res = this.$refs.treeNode;
          let nodes = res.getCheckedNodes(true, true);
          this.batchSelect(this.options, res, true, nodes);
          this.treeLoading = false;
        }, 200);
      } else {
        this.$message.error(this.errMessage);
      }
    },
    // 输入框关键字
    dataFilter(val) {
      this.$refs.treeNode.filter(val);
    },
    /**
     * @description: tree搜索过滤
     * @param {*} value 搜索的关键字
     * @param {*} data  筛选到的节点
     * @return {*}
     */
    filterNode(value, data) {
      if (!value) return true;
      return (
        data[this.defaultProps.label]
          .toLowerCase()
          .indexOf(value.toLowerCase()) !== -1
      );
    },
    /**
     * @description: 勾选树形选项
     * @param {*} data 该节点所对应的对象
     * @param {*} self 节点本身是否被选中
     * @param {*} child 节点的子树中是否有被选中的节点
     * @return {*}
     */
    handleNodeChange(data, self, child, checkObj) {
        const flag = this.defaultValue.some((v) => v === data[this.VALUE_NAME]);
        let datalist = this.$refs.treeNode.getCheckedNodes();
        if (!self && !this.isCanDelete && flag) {
          this.$message.error(this.errMessage);
          this.$refs.treeNode.setChecked(data, true, true);
        }
        if (!this.checkStrictly) {
          // 如果联动则需处理父子值关系
          const parentList = datalist
            .filter((v) => v[this.defaultProps.children])
            .map((v) => v[this.VALUE_NAME]);
          datalist = datalist.filter(
            (v) => parentList.indexOf(v[this.parentValue]) === -1
          );
        }
        this.selectTree = datalist;
        this.selectValue = datalist.map((v) => v[this.VALUE_TEXT]);
        this.$emit("changeSelectDataList", this.selectTree);
    },
    // 移除单个标签
    removeTag(tagName) {
      const flagName = this.selectTree
        .filter(
          (v) =>
            v[this.VALUE_NAME] ===
            this.defaultValue.find((item) => item === v[this.VALUE_NAME])
        )
        .map((v) => v[this.VALUE_TEXT]);
      const flag = flagName.includes(tagName);
      if (this.isCanDelete) {
        // 判断回显的值是否可删除
        this.selectTree = this.selectTree.filter(
          (v) => v[this.VALUE_TEXT] !== tagName
        );
        const selectTreeValue = this.selectTree.map((v) => v[this.VALUE_NAME]);
        let setlist = this.$refs.treeNode.getCheckedNodes();
        setlist = setlist.filter(
          (v) =>
            v[this.VALUE_NAME] ===
            selectTreeValue.find((item) => item === v[this.VALUE_NAME])
        );
        this.$nextTick(() => {
          this.$refs.treeNode.setCheckedNodes(setlist);
        });
        this.$emit("changeSelectDataList", this.selectTree);
      } else {
        if (!flag) {
          // 判断回显时新增的是否可删除
          this.selectTree = this.selectTree.filter(
            (v) => v[this.VALUE_TEXT] !== tagName
          );
          const selectTreeValue = this.selectTree.map(
            (v) => v[this.VALUE_NAME]
          );
          let setlist = this.$refs.treeNode.getCheckedNodes();
          setlist = setlist.filter(
            (v) =>
              v[this.VALUE_NAME] ===
              selectTreeValue.find((item) => item === v[this.VALUE_NAME])
          );
          this.$nextTick(() => {
            this.$refs.treeNode.setCheckedNodes(setlist);
          });
          this.$emit("changeSelectDataList", this.selectTree);
        } else {
          this.selectValue = this.selectTree.map((v) => v[this.VALUE_TEXT]);
          this.$message.error(this.errMessage);
        }
      }
    },
    // 文本框清空
    clearAll() {
      this.selectTree = [];
      this.$refs.treeNode.setCheckedNodes([]);
      this.$emit("changeSelectDataList", this.selectTree);
    },
  },
};
</script>
  
  <style lang="less" scoped>
/deep/.el-popper {
  min-width: 230px !important;
}
/deep/.el-color-picker__icon,
.el-input,
.el-textarea {
  width: 60%;
}
.select-box {
  position: relative;
}
.input-select {
  position: absolute;
  left: 8%;
  top: 2%;
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /deep/.el-input__inner {
    width: 190px !important;
  }
}
.check-box {
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.el-scrollbar {
  height: 370px;
  .el-select-dropdown__wrap {
    max-height: 370px;
    overflow: hidden;
    .el-select-dropdown__list {
      padding: 20px;
    }
  }
}
.option-style {
  height: 300px;
  padding: 0 0 10px 0 !important;
  margin: 0;
  margin-top: 30px;
  overflow-y: auto;
  cursor: default !important;
}
/deep/.el-select .el-tag {
  max-width: 70% !important;
}
/deep/.el-select {
  .el-select__tags {
    span {
      width: 100%;
      display: flex;
      justify-content: flex-start;
    }
  }
}
/deep/.el-select__input {
  width: 0px;
  height: 0px;
}
</style>
  
  