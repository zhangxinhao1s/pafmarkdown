<template>
  <div class="tree-container">
    <div v-if="showSearch" class="pl_20 pr_20 pb_12">
      <el-input placeholder="输入关键字" v-model="filterText">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <slot></slot>
    <el-tree
      ref="tree"
      :data="data"
      v-bind="$attrs"
      v-on="$listeners"
      :expand-on-click-node="false"
      highlight-current
      :filter-node-method="filterNode"
    >
      <section class="custom-tree-node" slot-scope="{ node, data }">
        <i class="el-icon-folder" v-if="!selectInputId"></i>
        <div class="flex text-over label-overflow">
          <!-- <span class="text-over">{{ node.label }}</span> -->
          <el-input
            v-if="data.id==selectInputId"
            @focus="focus($event)"
            @blur="blur($event)"
            ref="selectIpt"
            style="width: 120px"
            size="mini"
            v-model="selectInput"
          ></el-input>
          <SPTooltip
            v-else
            class="sp-tooltip-container ml_8"
            :refName="'str' + data[$props['node-key']]"
            className="tooltip-width"
            :content="node.label"
          >
          </SPTooltip>
          <slot name="suffix" :data="data" :node="node"></slot>
        </div>
        <div class="flex" @click.stop>
          <slot name="action" :data="data" :node="node"></slot>
          <el-dropdown
            v-if="showIcon"
            trigger="click"
            class="dropdown-container"
            @command="handleCommand($event, data, node)"
          >
            <i class="el-icon-more"></i>
            <el-dropdown-menu :ref="data.id" slot="dropdown">
              <slot name="dropdown-item" :data="data" :node="node"> </slot>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <i
          class="el-icon-more"
          slot="icon"
          @click.stop="showMenu($event, data, node)"
          v-if="showIcon"
        ></i> -->
      </section>
    </el-tree>
  </div>
</template>
<script>
import SPTooltip from "@/components/SPTooltip/SPTooltip";
export default {
  name: "SPTree",
  components: {
    SPTooltip,
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showSearch: {
      default: false,
    },
    defaultSelFirst: {
      //是否默认选择第一个
      default: false,
    },
    showIcon: {
      default: false,
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    data: {
      handler(val, preVal) {
        if (val && val.length > 0 && this.defaultSelFirst) {
          this.$nextTick(() => {
            this.$refs.tree.$el.firstElementChild.click(); //拿到tree的第一个dom元素模拟一个点击事件
            //或者这样拿第一个dom元素 this.$refs.tree.$children[0].$el)
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      filterText: "",
      selectInputId: "", // 选择节点需要操作的id
      selectInput: "新增卷", // 双向绑定需要更改名字的输入框
    };
  },
  mounted() {},
  methods: {
    getTreeNode(node) {
      if (node) {
        if (node.label !== undefined) {
          // this.parentList所有父级节点的信息
          console.log(node.data);
          this.parentList.push(node.data);
          this.getTreeNode(node.parent);
        }
      }
    },
    // showMenu($event, data, node) {
    //   // 选中节点的所有父级信息
    //   this.parentList = [];
    //   this.getTreeNode(node.parent);
    //   this.$emit("showMenu", $event, data, node, this.parentList);
    // },
    handleCommand($event, data, node) {
      // 选中节点的所有父级信息
      this.parentList = [];
      this.getTreeNode(node.parent);
      this.$emit("handleCommand", $event, data, node, this.parentList);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //  getAllNodes() {

    //    const tree = this.$refs["tree"]

    //   console.log('this.$refs["tree"]==',tree)
    // },
    getNode(id) {
      return this.$refs["tree"].getNode(id);
    },
    setChecked(id, checked) {
      this.$refs["tree"].setChecked(id, checked);
    },
    getCheckedNodes() {
      return this.$refs["tree"].getCheckedNodes();
    },
    getHalfCheckedNodes() {
      return this.$refs["tree"].getHalfCheckedNodes();
    },
    getTreeRef() {
      return this.$refs["tree"];
    },
    checkShowMoreIcon(list) {
      //  console.log('id===',id)
      //  this.$nextTick(()=>{
      //       console.log('this.$refs[id]===',this.$refs[id])
      //  })
      //  return true
      list.forEach((e) => {
        if (e.children && e.children.length > 0) {
          this.checkShowMoreIcon(e.children);
        }
      });
    },
    // 输入框聚焦事件
    focus(e) {
      this.$refs.selectIpt.focus();
      this.$refs.selectIpt.select();
      // console.log(e);
    },
    // 输入框失焦事件
    blur(e) {
      // console.log(e);
      this.selectInputId=""
      this.$emit("update")
    },
  },
};
</script>
<style lang="less" scoped>
.tree-container {
  // background: #fff;
  //  overflow: auto;
  .custom-tree-node {
    // flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    font-size: 14px;
    padding-right: 10px;
    color: #444444;
    .label-overflow {
      flex: 1;
      width: 0;
    }
    .sp-tooltip-container {
      flex: 1;
      width: 0;
      color: #1890ff !important;
    }

    .tooltip-width {
      width: 100%;
      color: #999999;
      //  width: 0;
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.el-tooltip {
  color: #444 !important;
}
/deep/ .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
/deep/ .el-tree-node__expand-icon {
  transform: initial;
  transition: auto;
}

/deep/ .el-icon-caret-right:before {
  content: "\e791";
  font-size: 18px;
}

/deep/.el-icon-folder {
  color: #1890ff !important ;
  font-size: 18px;
  line-height: 20px;
}

/deep/ .el-tree-node__expand-icon {
  margin-left: 15px;
  // padding: 0px !important;
}

/deep/ .el-tree-node__expand-icon.is-leaf {
  margin-left: 15px;
}

/deep/ .el-tree-node {
  position: relative;
  // padding-left: 16px;
}

/deep/ .el-tree-node__children {
  padding-left: 16px;
}

/deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

/deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}
/deep/ .el-tree > .el-tree-node > .el-tree-node__content > .is-leaf::after {
  border-top: none;
}

/deep/ .el-tree-node:before {
  content: "";
  left: 10px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-left: 1px dashed #d9d9d9;
  bottom: 0px;
  height: 100%;
  top: -21px;
  width: 1px;
}

/deep/ .el-tree-node:after {
  content: "";
  left: 10px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-top: 1px dashed #d9d9d9;
  height: 25px;
  top: 16px;
  width: 10px;
}
/deep/ .is-leaf:after {
  content: "";
  left: 21px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-top: 1px dashed #d9d9d9;
  height: 25px;
  top: 16px;
  width: 14px;
}

/deep/ .el-tree-node:last-child::before {
  height: 38px; // 可以自己调节到合适数值
}

/deep/ .el-tree .el-tree-node {
  position: relative;
}
/deep/ .el-tree-node .el-tree-node__content {
  height: 32px;
  padding-left: 0px !important;
}
/deep/ .el-tree-node .el-tree-node__content::before {
  border-left: 1px solid #d9d9d9;
  height: 100%;
  top: 0;
  width: 1px;
  margin-left: 1px;
  margin-top: 0px;
  z-index: 8;
}
/deep/ .el-tree-node .el-tree-node__children .el-tree-node__content::before {
  border-left: 0px solid #d9d9d9;
  height: 100%;
  top: 0;
  width: 1px;
  margin-left: 1px;
  margin-top: 0px;
  z-index: 8;
}

/deep/ .el-tree-node .el-tree-node__content::after {
  // border-top: 1px solid #d9d9d9;
  height: 1px;
  top: 18px;
  width: 13px;
  margin-left: 1px;
  z-index: 8;
}

/deep/ .el-tree-node .el-tree-node__children .el-tree-node__content::after {
  border-top: 0px solid #d9d9d9;
}
/deep/ .el-tree-node:focus > .el-tree-node__content {
  //    background-color: #F5F801;
  color: #3581fd;
}
// /deep/ .icon-tree {
//   height: 16px;
//   width: 16px;
//   margin: 0 5px 0 10px;
//   position: relative;
//   background: url("../../assets/icons/icon_plus_expand.png");
//   background-size: 100% 100%;
// }
// /deep/ .expanded {
//   background: url("../../assets/icons/icon_minus_close.png");
//   background-size: 100% 100%;
// }
// /deep/ .is-leaf {
//   background-image: none;
//   background-size: 100% 100%;
// }
// /deep/ .icon-tree {
//     height: 16px;
//     width: 16px;
//     line-height: 16px;
//     border: 1px solid #d9d9d9;
//     margin-right: 8px;
// }
/deep/ .icon-tree::before {
  content: "+";
  display: inline-block;
  line-height: 16px;
  text-align: center;
  height: 16px;
  width: 16px;
  position: relative;
  font-size: 18px;
  top: 0px;
  right: 2px;
  border: 1px solid #d9d9d9;
  margin-right: 0px;
}
/deep/ .expanded::before {
  content: "-";
  display: inline-block;
  height: 16px;
  width: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 18px;
  position: relative;
  top: 0px;
  right: 2px;
}
/deep/ .is-leaf::before {
  display: inline-block;
  line-height: 16px;
  text-align: center;
  height: 16px;
  width: 16px;
  position: relative;
  font-size: 18px;
  top: 0px;
  right: 2px;
  border: 1px solid transparent;
  margin-right: 0px;
}

//  .el-tree-node .el-tree-node__content::before, .tree-container .el-tree-node .el-tree-node__content::after {
// 	content: '';
// 	position: absolute;
// 	right: auto;
// }
</style>