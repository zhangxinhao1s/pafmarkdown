<template>
  <div style="height: 100%">
    <router-view v-if="refShow" />

  </div>
</template>
<script>
import storage from "@/utils/storage/storage";
export default {
  provide() {
    return {
      appReload: this.appReload,
    };
  },
  data() {
    return {
      visible: false,
      refShow: true,
    };
  },
  methods: {
    appReload() {
      this.refShow = false;
      this.$nextTick(() => {
        this.refShow = true;
      });
    },
    close() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less">
// @import "./styles/base.less"; //在此引入权重较低，建议在man.js中引入
.app-container {
  font-family: "PingFangSC-Semibold", "Avenir", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.dialogText {
  font-size: 22px;
  color: #03377f;
  text-align: center;
  width: 100%;
}
// 页面中使用 el-popover在body中
.el-popper[x-placement^="bottom"] {
  padding: 0 10px !important;
  min-width: 80px !important;
  .list-btn {
    .button {
      display: block;
      text-align: left;
      background-color: #fff;
      border: 1px solid #fff;
      padding: 3px 0 0 5px;
      cursor: not-allowed;
      a[disabled] {
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
        pointer-events: none;
        i[data-v-24c257da] {
          float: left;
        }
        .dzjz-icon-cover {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/fm-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        b {
          font-size: 15px;
        }
        .dzjz-icon-ml {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/ml-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-lm {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/lm-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-cm {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/cm-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-tm {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/tm-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-szym {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/szym-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-lxy {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/lxy-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-bkb {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/bkb-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-fd {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/fd-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
        .dzjz-icon-OCRsb {
          width: 20px;
          height: 20px;
          background: url("./assets/icons/OCRsb-1.png") 0 4px no-repeat;
          margin-top: -3px;
        }
      }
    }
    .button[data-v-24c257da] {
      height: 25px;
    }
    .button:hover {
      border: 1px solid #1890ff;
      background-color: rgba(103, 139, 221, 0.25);
    }
    .button_active_fm {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-cover {
          background: url("./assets/icons/fm.png") 0 4px no-repeat;
        }
      }
    }
    .button_active_ml {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-ml {
          background: url("./assets/icons/ml.png") 0 4px no-repeat;
        }
      }
    }
    .button_active_bkb {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-bkb {
          background: url("./assets/icons/bkb.png") 0 4px no-repeat;
        }
      }
    }
    .button_active_fd {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-fd {
          background: url("./assets/icons/fd.png") 0 4px no-repeat;
        }
      }
    }
    .button_active_lm {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-lm {
          background: url("./assets/icons/lm.png") 0 4px no-repeat;
        }
      }
    }
    .button_active_tm {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-tm {
          background: url("./assets/icons/tm.png") 0 4px no-repeat;
        }
      }
    }
    .button_active_lxy {
      cursor: pointer;
      a[disabled] {
        color: #1890ff;
        .dzjz-icon-lxy {
          background: url("./assets/icons/lxy.png") 0 4px no-repeat;
        }
      }
    }
  }
}
</style>
