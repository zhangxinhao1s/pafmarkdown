<template>
  <div>
    <el-button size="small" @click="showDialog">
      <svg-icon icon-class="icon_upload" class="icon_upload"></svg-icon>
      上传文件
    </el-button>
    <slot></slot>
    <el-dialog
      custom-class="confirm-dailog"
      :visible.sync="visible"
      width="630px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :before-close="close"
      title="文件上传"
      :append-to-body="true"
    >
      <el-upload
        action
        multiple
        :limit="limit"
        :show-file-list="false"
        :file-list="showFileList"
        :auto-upload="false"
        :accept="accept"
        :on-change="uploadCover"
        :on-exceed="handleEexceed"
        :before-remove="beforeRemove"
        :disabled="disabledButton"
        ref="upload"
      >
        <el-button size="small" type="primary">选择文件</el-button>
        <div class="el-upload__tip" slot="tip">
          文件格式仅支持doc,docx,pdf,jpg,png,avi,rmvb,rar,单次最多上传
          5个文件，单个文件最大上传大小为10M
        </div>
      </el-upload>
      <transition-group name="list" tag="div">
        <div class="upload-progress" v-for="item in fileList" :key="item.name">
          <div class="item-progress">
            <div>
              <i
                class="el-icon-document"
                :class="item.color === '#f56c6c' ? 'exception' : ''"
              ></i>
              <span
                class="progress-name"
                :class="item.color === '#f56c6c' ? 'exception' : ''"
                >{{ item.name }}</span
              >
            </div>
            <i class="el-icon-close del" @click="delFile(i)"></i>
          </div>
          <el-progress
            class="progress"
            :percentage="item.progress"
            :color="item.color"
            :format="item.color === '#f56c6c' && format"
          ></el-progress>
        </div>
      </transition-group>
      <div class="dialog-footer" slot="footer">
        <el-button size="samll" @click="close">取消</el-button>
        <el-button
          size="samll"
          @click.stop="onsubmit"
          type="primary"
          :disabled="disabledButton"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crypto from "@/utils/crypto-util";
import { debounce } from "@/utils/debounce.js";
import { APP_SECRET, SYS_ID } from "@/network/constant";
import storage from "@/utils/storage/storage";
export default {
  name: "SP-upload",
  inject: {
    uploadFile: {
      fromL: "upload",
    },
  },
  props: {
    limit: {
      type: Number,
      default: 5,
    },
    accept: {
      type: String,
      default: "",
    },
    clueId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tagNum: 0, //判断多次上传
      tagSuccess: [], //上传成功文件的小标集合
      visible: false, //上传弹窗
      showFileList: [],
      fileList: [],
      successFile: [],
      disabledButton: false,
    };
  },
  watch: {
    tagNum(val) {
      const that = this;
      if (val === that.fileList.length && that.tagNum !== 0) {
        this.tagNum = 0;
        this.disabledButton = false;
        // 判断添加数据成功后就调用列表查询
        if (this.tagSuccess.length) {
          that.$emit("getFileList", that.successFile);
        }
        // 判断上传失败不让关闭弹窗
        if (that.tagSuccess.length === that.fileList.length) {
          setTimeout(() => {
            that.close();
          }, 500);
        } else {
          that.tagSuccess.forEach((item) => {
            that.fileList.forEach(ele, (i) => {
              if (item.name === ele.name) {
                that.fileList.splice(i, 1);
                that.showFileList.splice(i, 1);
              }
            });
          });
        }
        that.tagSuccess = [];
      }
    },
  },
  methods: {
    showDialog() {
      this.visible = true;
      this.disabledButton = false;
    },
    close() {
      this.fileList.forEach((item) => {
        if (item.cancel) item.cancel();
      });
      this.fileList = [];
      this.successFile = [];
      this.showFileList = [];
      this.visible = false;
    },
    format() {
      return "失败";
    },
    uploadCover(file, fileList) {
      const that = this;
      const limitSize = file.size / 1024 / 1024 < 10;
      const fileSize = file.size / 1024 / 1024 > 0;
      for (let i = 0; i < this.fileList, length; i += 1) {
        if (this.fileList[i].name === file.name) {
          that.$message.error(`${file.name}文件已选中，不能重复上传`);
          this.fileList.splice(i, 1);
          fileList.splice(i, 1);
          i -= 1;
        }
      }
      if (!limitSize) {
        that.$message.error(`${file.name}文件超过10MB，需要大文件上传`);
        for (let i = 0; i < fileList.length; i += 1) {
          if (fileList[i].name === file.name) {
            fileList.splice(i, 1);
            i -= 1;
          }
        }
      } else if (!fileSize) {
        that.$message.error(`${file.name}空文件，不能上传`);
        for (let i = 0; i < fileList.length; i += 1) {
          if (fileList[i].name === file.name) {
            fileList.splice(i, 1);
            i -= 1;
          }
        }
      } else {
        this.fileList.push(file);
      }
    },
    onsubmit() {
      debounce(() => {
        this.confirm();
      }, 500);
    },
    comfirm() {
      if (!this.fileList.length) {
        this.$message.error("上传文件不能为空！");
        return;
      }
      this.fileList.forEach(item, (index) => {
        this.submit(item, index);
      });
    },
    submit(file, index) {
      const formData = new FormData();
      formData.append("file", file.raw);
      formData.append("sysId", SYS_ID);
      formData.append("needSyncFlag", crypto.AESEnc(APP_SECRET, "1"));
      if (this.clueId) {
        formData.append("clueId", crypto.AESEnc(APP_SECRET, this.clueId));
      }
      formData.append(
        "uploadUserId",
        crypto.AESEnc(APP_SECRET, storage.getItem("roloData").userId)
      );
      //   发起请求禁用操作按钮
      if (index === 0) {
        this.disabledButton = true;
      }
      const that = this;
      that
        .uploadFile(
          formData,
          (progressEvent) => {
            const obj = that.fileList[index];
            if (!obj) return;
            let progress = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            if (progress > 99) progress = 99;
            obj.progress = progress;
            that.$set(that.fileList, index, obj);
          },
          (cancel) => {
            const obj = that.fileList[index];
            obj.cancel = cancel;
            that.$set(that.fileList, index, obj);
          }
        )
        .then((res) => {
          that.tagNum += 1;
          if (res.code === 0) {
            const arr = JSON.parse(crypto.AESDec(APP_SECRET, res.data));
            if (arr[0] && arr[0].fileId) {
              that.$message.success(`${file.name}文件上传成功`);
              const obj = that.fileList[index];
              obj.progress = 100;
              obj.color = "#67c23a";
              that.$set(that.fileList, index, obj);
              that.successFile.push(
                ...JSON.parse(crypto.AESDec(APP_SECRET, res.data))
              );
              that.tagSuccess.push(file);
            } else {
              const obj = that.fileList[index];
              obj.color = "#f56c6c";
              that.$set(that.fileList, index, obj);
              that.$message({ type: "error", message: "文件上传失败" });
            }
          } else {
            const obj = that.fileList[index];
            obj.color = "#f56c6c";
            that.$set(that.fileList, index, obj);
            that.$message({ type: "error", message: "文件上传失败" });
          }
        })
        .catch((err) => {
          this.disabledButton = false;
          const obj = that.fileList[index];
          if (obj) {
            obj.color = "#f56c6c";
            that.$set(that.fileList, index, obj);
          }
        });
    },
    delFile(i) {
      if (this.fileList[i].cancel) this.fileList[i].cancel();
      this.fileList.splice(i, 1);
      this.showFileList.splice(i, 1);
    },
    handleExceed(files, fileList) {
      this.$message.error(
        `当前限制选择5个文件，本次选择了${file.length}个文件，共选择了${
          files.length + fileList.length
        }个文件`
      );
    },
  },
};
</script>

<style lang="less" scoped>
.upload-progress {
  margin-top: 10px;
  &:hover {
    background-color: #f5f7fa;
    cursor: pointer;
    .del {
      display: block;
    }
  }
  .item-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    font-size: 14px;
    line-height: 1.8;
    i {
      color: #909399;
    }
    .progress-name {
      margin-left: 5px;
    }
    .del {
      margin-right: 22px;
      display: none;
    }
    span {
      width: 100px;
    }
    .progress {
      width: 100%;
    }
  }
  .exception {
    color: #f56c6c !important;
  }
  .list-enter {
    opacity: 0;
    transform: translateY(-30px);
  }
  .list-enter-active {
    transition: all 0.6s ease-out;
  }
  .list-enter-to {
    opacity: 1;
  }
  .list-leave {
    opacity: 1;
  }
  .list-leave-active {
    transition: all 0.6s ease-out;
  }
  .list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
}
</style>