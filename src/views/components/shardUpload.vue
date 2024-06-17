<template>
  <div>
    <el-tooltip
      class="item"
      effect="light"
      content="上传文件"
      :disabled="!isIcon"
    >
      <el-upload
        class="upload-addfile"
        action=""
        :data="actiondata"
        multiple
        :limit="limit"
        :show-file-list="false"
        ref="upload"
        accept=".pdf,.jpg,.png,"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :http-request="uploadFunction"
        :before-upload="beforeUpload"
        :on-exceed="overExceed"
      >
        <el-button class="addfile"
          ><i class="el-icon-document-add"></i
          ><span v-if="!isIcon">{{title}}</span></el-button
        >
      </el-upload>
    </el-tooltip>
    <PdfReadyDialog ref="PdfReadyDialog" @updataFileList="updataFileList" />
  </div>
</template>

<script>
import {
  getTreeMl,
  saveAndUpdate,
  dzjzmlDelete,
  dzjzmlMlDrag,
  getJzmlwjInfo,
  pdfReady,
  Wjprocess,
  addMlFile,
  addFm,
  addMl,
  addBkb,
  addFd,
  getJcwjfp,
  postWjsc,
  postWjhb,
  yzpdfsfjm,
  postWjtj,
  getMaxWjsxh,
} from "../api/wjgl";
import storage from "@/utils/storage/storage";
import crypto from "crypto-js";
import { upload } from "@/network/uploadUtil";
import PdfReadyDialog from "./PdfReadyDialog";
export default {
    props: {
        clickNode: {
            type: Object,
            default: {}
        },
        clickObject: {
            type: Object,
            default: {}
        },
        title:{
            type: String,
            default:"" 
        }
    },
  components: {
    PdfReadyDialog,
  },
  data() {
    return {
      isIcon: false,
      isloading: false,
      md5: "",
      file: "",
      fileList: [],
      uploadedFiles: [],
      limit: 5,
      // 文件标识符
      actiondata: {
        uploadUserId: 1,
        // storeType: "NAS",
        needSyncFlag: 1,
      },
    };
  },
  methods: {
    // 刷新文件列表
    updataFileList() {
      this.isloading = false;
      this.fileList = [];
      if (this.clickNode.data.fmlbh == null) {
        this.getJzmlwjInfo(
          this.clickNode.data.jzbh,
          this.clickNode.data.mlbh,
          this.clickNode,
          this.clickNode.data
        );
      } else {
        this.getJzmlwjInfo(
          this.clickNode.data.jzbh,
          this.clickNode.data.mlbh,
          this.clickNode.parent,
          this.clickNode.parent.data
        );
      }
      // this.getJzmlwjInfo()
    },
        // 获取卷宗目录文件
    async getJzmlwjInfo(jzbh, mlbh, fNode, fData) {
      await getJzmlwjInfo({ jzbh, mlbh }).then((res) => {
        if (res.code == 0) {
          let imgData = [];
          res.data.forEach((item) => {
            imgData.push({
              ...item,
              checked: false,
            });
          });
          console.log('res.data*---1',res.data)
          this.$emit("getImgs", imgData, fNode, fData, mlbh);
          // this.$message.success("获取目录文件成功");
        }
      });
    },
    // 分割线--------文件接口
    // 删除文件
    handleRemove(file, fileList) {
      this.uploadedFiles = [];
      this.fileList = [];
    },
    // 上传成功
    handleSuccess(res, file) {
      console.log("file===", file);
      // this.addForm.fileId = res.data.id;
      //   this.file = file;
    },
    calcMD5(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function () {
          const wordArray = crypto.lib.WordArray.create(reader.result);
          const md5 = crypto.MD5(wordArray).toString();
          this.md5 = md5;
          console.log("22222222", md5);
          resolve(md5);
        };
        reader.onerror = function (event) {
          reject(event.target.error);
        };
      });
    },
    overExceed() {
      this.$message.warning("超出文件个数限制");
    },
    // 上传前
    beforeUpload(file) {
      this.file = file;
      this.fileList.push(file);
      console.log("fileList--------", this.fileList);
      // this.identifier = this.identifierCreate();
      console.log("beforeUpload---file==", file);
    },
    // 上传文件的钩子函数
    uploadFunction(file) {
      this.$store.commit("wjsc/SET_WJSC_FLAG", true);
      // console.log("file---------------this.md5-", this.calcMD5(file.file).then());
      this.calcMD5(file.file).then((res) => {
        this.md5 = res;
        this.isloading = true;
        // 每个文件切片大小定为5MB
        var sliceSize = 5 * 1024 * 1024;
        console.log("分片大小----", sliceSize);
        //文件大小限制为最大1个G，可根据需求修改
        var filesizes = 1 * 1024 * 1024 * 1024;
        let that = this;
        const blob = file.file;
        const fileSize = blob.size; // 文件大小
        const fileName = blob.name; // 文件名
        const fileType = blob.type; // 文件名
        //计算文件切片总数
        const totalSlice = Math.ceil(fileSize / sliceSize);
        console.log("总分片数量----", totalSlice);
        console.log("this.clickNode.data", this.clickNode.data);
        let jcwjfpData = {
          chunksize: sliceSize,
          dwbm: sessionStorage.getItem("dwbm"),
          identifier: res,
          jzbh: this.$route.query.id,
          totalchunks: totalSlice,
          wjdx: fileSize,
          wjlx: fileType,
          wjmc: fileName,
        };
        console.log("检察对象参数", jcwjfpData);
        getJcwjfp(jcwjfpData).then(async (resp) => {
          if (fileSize <= filesizes) {
            that.showbtn = false;
            // 循环上传
            let trueList = [];
            for (let i = 0; i < totalSlice; i++) {
              let start = i * sliceSize;
              let chunk = blob.slice(
                start,
                Math.min(fileSize, start + sliceSize)
              );
              let fromData = {
                file: chunk,
                identifier: resp.data,
                totalchunks: totalSlice,
                chunksize: sliceSize,
                chunkIndex: i + 1,
                wjdx: filesizes,
                wjlx: fileType,
                wjmc: fileName,
                jzbh: this.$route.query.id,
                dwbm: sessionStorage.getItem("dwbm"),
              };
              await upload(fromData).then((resp) => {
                console.log("resp----", resp);
                if (resp.data == true) {
                  trueList.push({ flag: true });
                }
              }); //一个分片上传完成后再调用接口上传下一片
            }
            console.log("trueList", trueList, totalSlice);
            if (trueList.length == totalSlice) {
              // that.$message.success('文件上传成功')
              // that.showbtn = true;
              let data = {
                id: resp.data,
              };
              postWjhb(data).then((hbRes) => {
                if (hbRes.data == true) {
                  getMaxWjsxh({ mlbh: this.clickObject.fData.mlbh}).then(
                    (sxhRes) => {
                      if (fileType.indexOf("pdf") != -1) {
                        let data = {
                          id: resp.data,
                        };
                        //验证pdf文件是否加密，加密则打开弹窗，否则提交
                        yzpdfsfjm(data).then((pdfRes) => {
                          if (pdfRes.data == false) {
                            let data = {
                              id: resp.data,
                              jzbh: this.clickNode.data.jzbh,
                              mlbh: this.clickNode.data.mlbh,
                              wjsxh: sxhRes.data,
                              tjlx:1,
                            };
                            postWjtj(data).then((tjRes) => {
                              if (tjRes.data != null) {
                                console.log("that.showbtn", that.isloading);
                                that.isloading = false;
                                that.$message({
                                  message: "文件上传成功",
                                  type: "success",
                                });
                              }
                            });
                          } else {
                            let data = {
                              id: resp.data,
                              jzbh: this.clickNode.data.jzbh,
                              mlbh: this.clickNode.data.mlbh,
                              wjsxh: sxhRes.data,
                              tjlx:1
                            };
                            this.$refs.PdfReadyDialog.open(resp.data, data);
                          }
                        });
                      } else {
                        let data = {
                          id: resp.data,
                          jzbh: this.clickNode.data.jzbh,
                          mlbh: this.clickNode.data.mlbh,
                          wjsxh: sxhRes.data,
                          tjlx:1,
                        };
                        postWjtj(data).then((tjRes) => {
                          if (tjRes.data != null) {
                            this.fileList = [];
                            console.log("that.showbtn", that.isloading);
                            that.isloading = false;
                            that.$message({
                              message: "文件上传成功",
                              type: "success",
                            });
                          }
                        });
                      }
                    }
                  );
                }
              });
            } else {
              that.$message.error("文件上传失败");
              that.showbtn = true;
            }
          } else {
            that.showbtn = true;
            that.$message({
              message: "文件大小超出1G",
              type: "error",
            });
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>