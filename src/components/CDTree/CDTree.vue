<template>
  <div class="cdtree">
    <el-tree
      :data="data"
      node-key="mlbh"
      :props="treeProps"
      ref="tree"
      lazy
      :load="getDeptDatas"
      :draggable="true"
      :allow-drop="allowDrop"
      @node-drop="sortNode"
      :expand-on-click-node="expandNode"
      @node-expand="expandHandle"
      :filter-node-method="filterNode"
      highlight-current
      v-on="$listeners"
    >
      <div
        class="flexbox"
        slot-scope="{ node, data }"
        @click="treeClick(node, data)"
        @mouseenter="showdesk(data)"
        @mouseleave="downdesk(data)"
      >
        <el-input
          v-if="data.mlbh == selectInputId"
          @focus="focus($event)"
          @blur="blur($event, node)"
          ref="selectIpt"
          style="width: 120px; height: 20px"
          size="mini"
          v-model="selectInput"
        ></el-input>
        <span v-else>
          <img
            src="@/assets/icons/wj.png"
            alt=""
            v-if="data.jdlx == 1"
          />
          <img src="@/assets/icons/456.png" alt="" v-if="data.jdlx == 3" />
          <img
            src="@/assets/icons/123.png"
            alt=""
            v-if="data.jdlx == 2"
          />
          <span style="margin-left: 12px" v-if="data.jdlx != 4">{{
            node.label
          }}</span>
          <span style="margin-left: 24px" v-if="data.jdlx == 4">{{
            node.label
          }}</span>
          <b v-show="data.leaf && node.level == 1" style="font-size: 12px"
            >(暂无目录数据)</b
          ></span
        >
        <span
          :class="[selectInputId ? 'desk1' : 'desk']"
          v-show="data.show"
          v-if="!isReadOnly"
          style="
            display: flex;
            justify-content: flex-start;
            align-items: center;
          "
        >
          <el-tooltip
            class="item"
            effect="light"
            placement="bottom"
            content="新增目录"
          >
            <i
              class="el-icon-plus"
              @click.stop="addCase(node, data)"
              v-show="data.datamode == 'juan'"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            placement="bottom"
            content="编辑"
          >
            <img
              src="@/assets/icons/handle.png"
              alt=""
              style="width: 14px; height: 14px; margin-left: 8px"
              @click.stop="editCase(data.mlbh, data.mlxsmc, data.fmlbh)"
              v-show="
                data.mlxsmc == '封面' ||
                data.mlxsmc == '目录' ||
                data.mlxsmc == '备考表' ||
                data.mlxsmc == '封底'
                  ? false
                  : true
              "
            />
            <!-- <img src="" alt=""> -->
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            placement="bottom"
            content="删除卷"
          >
            <i class="el-icon-delete" @click.stop="delCase(node, data)"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="light"
            placement="bottom"
            content="重置卷"
          >
            <i
              class="el-icon-refresh"
              @click.stop="czCase(node, data)"
              v-show="data.leaf == false && data.jdlx == 1"
            ></i>
          </el-tooltip>
        </span></div
    ></el-tree>
  </div>
</template>

<script>
import { getTreeMl } from "../../views/api/wjgl";
export default {
  props: {
    data: {
      type: [Object, Array],
      default: {},
    },
    defaultSelFirst: {
      //是否默认选择第一个
      default: false,
    },
    // 点击节点是否展开
    expandNode: {
      type: Boolean,
      default: false,
    },
    isReadOnly: {
      type: Boolean,
      default: false,
    },
    filterText: {
      type: String,
      default: false,
    },
  },
  name: "CDTree",
  data() {
    return {
      selectInputId: "", // 选择节点需要操作的id
      selectInput: "", // 双向绑定需要更改名字的输入框
      treeProps: {
        label: "mlxsmc",
        id: "mlbh",
        children: "children",
        isLeaf: (data, node) => {
          if (node.level === 3) {
            return true;
          }
        },
      },
      isTmml_Flag: false, // 同名特殊目录
    };
  },
  watch: {
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
    currentNodeKey: {
      handler(val, oldVal) {
        setTimeout(() => {
          //延时一下，避免在某些场景未展开时会无效
          this.$refs["tree"] && this.$refs["tree"].setCurrentKey(val);
        }, 400);
      },
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    expandHandle(val) {
      this.$emit("expandClick", val);
    },
    //筛选
    filterNode(value, data) {
      console.log("value---", value);
      console.log("data---", data);
      if (!value) return true;
      return data.mlxsmc.indexOf(value) !== -1;
    },
    async getDeptDatas(node, resolve) {
      if (node.data.length !=0 && node.isLeaf == false) {
        (node.loading = false), (node.expanded = true);
        this.$emit("twoTreeData", node.data.mlbh, node.data.jdlx);
      } else {
        node.expanded = true;
        node.loading = false;
      }
    },
    // 添加目录
    addCase(node, data) {
      data.leaf = false;
      node.expanded = true;
      if (node.data.leaf == true) {
        node.data.isXj = true;
        this.$emit("saveMulu", data.mlbh, "mulu", data.jzbh);
      } else {
        if (node.data.isXj) {
          setTimeout(() => {
            this.$emit("saveMulu", data.mlbh, "mulu", data.jzbh, node);
          }, 100);
        } else {
          this.getDeptDatas(node);
          setTimeout(() => {
            this.$emit("saveMulu", data.mlbh, "mulu", data.jzbh, node);
          }, 100);
        }
      }
      if (node.isLeaf) {
        this.$nextTick(() => {
          node.data.leaf = false;
          this.$set(node, "isLeaf", false);
        });
      }
    },
    // 添加目录文件
    addCaseTjml(node, data, AddMlMc) {
      this.getDeptDatas(node);
      node.expanded = true;
      if (node.data.leaf == true) {
        this.$nextTick(() => {
          data.leaf = false;
          node.isLeaf = false;
        });
        this.$emit("saveMuluTjml", data.mlbh, "mulu", data.jzbh, AddMlMc);
      } else {
        this.$nextTick(() => {
          data.leaf = false;
          node.isLeaf = false;
        });
        setTimeout(() => {
          this.$emit("saveMuluTjml", data.mlbh, "mulu", data.jzbh, AddMlMc);
        }, 100);
      }
    },
    // 封面目录
    addCaseFmMl(node, data, mlmc) {
      this.getDeptDatas(node);
      node.expanded = true;
      if (node.data.leaf == true) {
        this.$nextTick(() => {
          data.leaf = false;
          node.isLeaf = false;
        });
        if (this.isTmml_Flag) {
          console.log("已有想要添加的特殊目录");
        } else {
          this.$emit("saveMuluTjml", data.mlbh, "mulu", data.jzbh, mlmc);
        }
      } else {
        this.$nextTick(() => {
          data.leaf = false;
          node.isLeaf = false;
        });
        setTimeout(() => {
          if (this.isTmml_Flag) {
            console.log("已有想要添加的特殊目录");
          } else {
            this.$emit("saveMuluTjml", data.mlbh, "mulu", data.jzbh, mlmc);
          }
        }, 100);
      }
      this.isTmml_Flag = false;
    },
    // 编辑卷
    editCase(mlbh, mlxsmc, fmlbh) {
      this.selectInputId = mlbh;
      this.selectInput = mlxsmc;
      this.$nextTick(() => {
        this.focus();
      });
      this.$emit("setMlbhId", this.selectInputId, fmlbh);
      // console.log(fmlbh, "编辑");
    },
    // 删除目录
    delCase(node, data) {
      this.$confirm("删除后无法找回，确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs.tree.remove(node);
          this.$nextTick(() => {
            this.$emit("dzjzmlDelete", data.mlbh);
          });
        })
        .catch((e) => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
      // console.log("删除", data);
    },
    // 鼠标移入移除图标的显示隐藏
    showdesk(data) {
      data.show = true;
    },
    downdesk(data) {
      data.show = false;
    },
    // 目录拖拽
    allowDrop(draggingNode, dropNode, type) {
      // console.log(draggingNode, dropNode, type, "拖拽控制");
      if (draggingNode.data.level === dropNode.data.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          return type === "prev" || type === "next";
        } else {
          return false;
        }
      }
    },
    //重置卷
    czCase(node, data) {
      this.$confirm("重置卷后目录将被删除，确定要重置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$nextTick(() => {
            let nextData = {
              mlbh: data.mlbh,
              jzbh: data.jzbh,
            };
            this.$emit("jzczClick", nextData);
          });
        })
        .catch((e) => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
    // 节点重排序
    sortNode(draggingNode, dropNode, type, event) {
      // console.log(draggingNode,dropNode,"draggingNode-----");
      console.log(dropNode);
      let id = 0;
      if (dropNode.level == 1) {
        dropNode.parent.data.forEach((e, i) => {
          if (e.mlbh == dropNode.data.mlbh) {
            console.log(i, "顺序", type);
            if (type == "before") {
              id = i;
            } else {
              id = Number(i) + 2;
            }
          }
        });
      } else if (dropNode.level == 2) {
        dropNode.parent.data.children.forEach((e, i) => {
          if (e.mlbh == dropNode.data.mlbh) {
            console.log(i, "顺序", type);
            if (type == "before") {
              id = i;
            } else {
              id = Number(i) + 2;
            }
          }
        });
      }
      // let obj = {
      //   aboveId: "",
      //   arr: [],
      // };
      // obj.aboveId = dropNode.id;
      this.$emit("MlDrag", draggingNode.data.mlbh, id);
    },
    // 树的每个节点点击
    treeClick(node, data) {
      // console.log(111, node, data, "点击树节点");
      this.$emit("identifierCode", data.mlbh);
    },
    // 输入框聚焦事件
    focus(e) {
      this.$refs.selectIpt.focus();
      this.$refs.selectIpt.select();
      // console.log(e);
    },
    // 输入框失焦事件
    blur(e, node) {
      // console.log(e);
      if (this.selectInput == "") {
        this.$message({
          type: "info",
          message: "卷宗或目录名称不能为空",
        });
        this.$refs.tree.remove(node);
      } else {
        this.$emit("update");
      }
      this.selectInputId = "";
    },
  //   getNode(id) {
  //     console.log('id------',id)
  //     let node = this.$refs.tree.getNode(id);
  //     console.log("node------", node);
  //     node.loaded = false;
  //     node.expand();
  //     this.$emit("updateMl", node);
  //   },
  },
};
</script>

<style lang="less" scoped>
.flexbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  //   .lefttext {
  //     color: #4f5e7b;
  //   }
  //   .is-current {
  //     .lefttext {
  //       color: #4f5e7b !important;
  //     }
  //   }
}
.desk {
  i {
    margin-left: 10px;
  }
}
.desk1 {
  margin-top: 4px;
  i {
    margin-left: 10px;
  }
}
/deep/.el-input--mini .el-input__inner {
  height: 26px;
  line-height: 26px;
  margin-top: -3px;
}
</style>