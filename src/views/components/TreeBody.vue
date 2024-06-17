<template>
  <div class="treebody">
    <el-alert class="loadAlert" type="warning" v-show="isloading"
      ><span slot="title"
        ><i
          class="el-icon-refresh-right"
          style="font-size: 20px"
          v-loading="true"
          element-loading-spinner="el-icon-loading"
        ></i>
        上传中，请稍后</span
      ></el-alert
    >
    <div class="tree-title">
      <div class="left-name">目录展示方式</div>
      <div>
        <el-select v-model="mlValue" placeholder="请选择" @change="mlChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="tree-select">
      <el-input
        placeholder="请输入内容"
        v-model="selectValue"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="header" style="padding-top: 5px" v-if="!isReadOnly">
      <div v-if="clFlag">
        <el-button class="addtask" @click="addtask"
          ><i class="el-icon-plus"></i> 添加卷</el-button
        >
      </div>
      <!-- <div v-if="!isReadOnly">
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
              ><span v-if="!isIcon">上传文件</span></el-button
            >
          </el-upload>
        </el-tooltip>
      </div> -->
      <div v-if="clFlag">
        <ShardUploadVue
        v-if="treeData.length > 0"
        :clickNode="clickNode"
        :clickObject="clickObject"
        :title="'上传文件'"
      ></ShardUploadVue>
      </div>
    </div>
    <div class="content">
      <CDTree
        ref="spTree"
        :jzbh="jzbh"
        :data="treeData"
        @update="saveAndUpdate"
        @setMlbhId="setMlbhId"
        @dzjzmlDelete="dzjzmlDelete"
        @jzczClick="jzczClick"
        @saveMulu="saveMulu"
        @twoTreeData="twoTreeData"
        @MlDrag="MlDrag"
        @identifierCode="identifierCode"
        @node-click="handleNodeClick"
        @expandClick="expandClick"
        :defaultSelFirst="true"
        @saveMuluTjml="saveMuluTjml"
        :filterText="selectValue"
        :isReadOnly="isReadOnly"
        v-if="mlValue==1"
        @updateMl="updateMl"
      ></CDTree>
      <CLTree
        ref="clTree"
        :data="clTreeData"
        @twoTreeData="clTwoTreeData"
        @identifierCode="identifierCode"
        @node-click="clHandleNodeClick"
        @expandClick="clExpandClick"
        :defaultSelFirst="true"
        :filterText="selectValue"
        :isReadOnly="isReadOnly"
        v-else
      ></CLTree>
    </div>
    <div class="bottom">
      <ul>
        <li>
          总识别情况<span style="padding-left: 10px">{{
            distinguishData.situationActure
          }}</span
          >/<span>{{ distinguishData.situationAll }}</span>
        </li>
        <li>
          卷数<span>({{ treeData.length }})</span>
        </li>
      </ul>
    </div>
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
  dzjzmlReset,
  getJzjbxx,
  getClflmlTree,
  getClflwjInfo,
} from "../api/wjgl";
import { changeUpload } from "@/views/common/utils/uploadUtils";
import { upload } from "@/network/uploadUtil";
import PdfReadyDialog from "./PdfReadyDialog";
import storage from "@/utils/storage/storage";
import crypto from "crypto-js";
import ShardUploadVue from "./shardUpload.vue";
import CLTree from "@/components/CLTree/CLTree.vue";
import CDTree from "@/components/CDTree/CDTree.vue";
export default {
  components: {
    PdfReadyDialog,
    ShardUploadVue,
    CDTree,
    CLTree
  },
  data() {
    return {
      fmlbh:'',
      clFlag:true,
      loading: false,
      clickObject: {},
      websocket: null,
      // WebSocket 地址
      WebSocket_URL: "",
      selectValue: "",
      isIcon: false,
      // 上传加载状态
      isloading: false,
      md5: "",
      // 树主体数据
      treeData: [
        // {
        //   label: "新增卷",
        //   mlbh: "123",
        //   datamode: "juan",
        //   show: false,
        //   children: [],
        // },
      ],
      clTreeData:[],
      defaultExpanded: [],
      // 识别数据
      distinguishData: {
        situationActure: 0,
        situationAll: 0,
        volume: 0,
      },
      // 卷宗编号
      jzbh: this.$route.query.id,
      // 模拟人员信息
      modulePerson: this.$store.state.user.userInfo,
      uuid: "",
      savefmlbh: "",
      zcFmlbh: [],
      // 文件上传参数
      //-----------

      limit: 5,
      // 文件列表
      file: {},
      fileList: [],
      uploadedFiles: [],
      mlbh: "", // 当前树节点点击的目录编号
      clickNode: {}, // 当前点击的节点
      wjxh: "",
      importType: "0",
      // 文件标识符
      actiondata: {
        uploadUserId: 1,
        // storeType: "NAS",
        needSyncFlag: 1,
      },
      isTmml: "", // 同名特殊目录
      isReadOnly: false,
      jdlx: 1,
      jdlxData: {},
      mlClickFlag: 0,
      mlClickData: {},
      mlValue: "1",
      options: [
        {
          value: "1",
          label: "原始目录展示",
        },
        {
          value: "2",
          label: "证据目录展示",
        },
      ],
      clJbh:'',
      clFlbm:'',
    };
  },
  watch:{
    "$store.state.clFlag":{
      handler(val){
        this.clFlag=val.clFlag
        console.log('clFlag---------',val)
      },
      deep:true
    },
  },
  created() {
    this.isReadOnly = JSON.parse(sessionStorage.getItem("readOnly"));
    this.getTreeMl();
    this.clGetTreeMl()
    this.getJzjbxx();
    this.connectWebSocket();
  },
  beforeDestroy() {
    if (this.webSocket) {
      this.onWebSocketClose();
    }
  },
  destroyed() {
    this.onWebSocketClose();
  },
  methods: {
    //切换目录
    mlChange(val) {
      this.treeData=[]
      this.clTreeData=[]
      this.jdlx=1
      this.zcFmlbh=[]
      // this.getTreeMl()
      if(val==1){
        this.getTreeMl();
        this.$store.commit("clFlag/SET_CL_FLAG",true)
      }else if(val==2){
        this.clGetTreeMl()
        this.$store.commit("clFlag/SET_CL_FLAG",false)
      }
      console.log("val------", val);
    },
    //卷宗基本信息
    getJzjbxx() {
      let data = {
        jzbh: this.$route.query.id,
      };
      getJzjbxx(data).then((res) => {
        this.distinguishData = {
          situationActure: res.data.ysbs,
          situationAll: res.data.wjs,
          volume: res.data.jzs,
        };
      });
    },
    //websocket
    connectWebSocket() {
      let url = process.env.VUE_APP_WEBSOCKET_API;
      let index = url.indexOf("://");
      let testUrl = url.substring(index + 1);
      let socketUrl = "ws:" + testUrl + sessionStorage.getItem("rybm");
      console.log("socketUrl--------", socketUrl);
      this.webSocket = new WebSocket(socketUrl);
      console.log("连接中", socketUrl);
      this.webSocket.onopen = this.onWebSocketOpen;
      this.webSocket.onmessage = this.onWebSocketMessage;
      this.webSocket.onerror = this.onWebSocketError;
      this.webSocket.onclose = this.onWebSocketClose;
    },
    onWebSocketOpen(event) {
      console.log("WebSocket连接成功", event);
      // 这里可以发送初始化消息给服务器
    },
    onWebSocketMessage(event) {
      // console.log("收到消息", JSON.parse(event.data));
      let eventData = JSON.parse(event.data);
      // this.getJzmlwjInfo()
      if (this.clickNode.data.fmlbh == null) {
        let data = [];
        data.push(eventData);
        if (
          (this.clickObject.mlbh == eventData.data.mlbh &&
            this.clickObject.jzbh == eventData.data.jzbh) ||
          eventData.type == "osc"
        ) {
          this.$store.commit("imgList/SET_IMG_LIST", data);
        }
      } else {
        let data = [];
        data.push(eventData);
        if (
          (this.clickObject.mlbh == eventData.data.mlbh &&
            this.clickObject.jzbh == eventData.data.jzbh) ||
          eventData.type == "osc"
        ) {
          this.$store.commit("imgList/SET_IMG_LIST", data);
        }
      }
      // 处理接收到的消息
    },
    onWebSocketError(event) {
      console.error("WebSocket连接发生错误", event);
      this.connectWebSocket();
      // 处理错误情况
    },
    onWebSocketClose(event) {
      console.log("WebSocket连接已关闭", event);
      // this.connectWebSocket();
      // 处理关闭连接
    },
    sendMessage(message) {
      if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.send(message);
      } else {
        console.error("WebSocket连接未建立或已关闭");
      }
    },
    readOlny() {
      this.isReadOnly = true;
    },
    // 获取卷宗目录
    async getTreeMl(getfmlbh) {
        await getTreeMl({
          jzbh: this.jzbh,
          mlbh: getfmlbh,
          jdlx: this.jdlx,
        }).then((res) => {
          if (getfmlbh) {
            this.treeData.forEach((item) => {
              if (this.jdlx == 1) {
                this.jdlx = 2;
              }
              let isFlag = false;
              if (item.mlbh == getfmlbh) {
                if (item.children.length === 1) {
                  isFlag = true;
                }
                if (!isFlag) {
                  res.data.forEach((twoItem) => {
                    item.children.push({
                      ...twoItem,
                      datamode: "mulu",
                      show: false,
                      children: [],
                    });
                  });
                }
                if (this.isTmml) {
                  item.children.forEach((item2) => {
                    if (item2.mlxsmc == this.isTmml) {
                      this.$refs.spTree.isTmml_Flag = true;
                    }
                  });
                }
              } else {
                res.data.forEach((twoItem) => {
                  this.treeData.forEach((item, index1) => {
                    item.children.forEach((item2, index2) => {
                      if (item.mlbh == item2.fmlbh) {
                        if (item2.mlbh == getfmlbh) {
                          item2.children = res.data;
                        }
                      }
                    });
                  });
                });
              }
            });
          } else {
            res.data.forEach((item) => {
              if (this.jdlx == 1) {
                // this.jdlxData=this.treeData[0]
                this.jdlx = 2;
              }
              this.treeData.push({
                ...item,
                datamode: "juan",
                show: false,
                children: [],
              });
            });
          }
        });
    },
    //获取材料目录
    async clGetTreeMl(getfmlbh) {
      await getClflmlTree({
          jzbh: this.jzbh,
          jbh: this.clJbh,
          flbm:this.clFlbm,
        }).then((res) => {
          if (getfmlbh) {
            this.clTreeData.forEach((item) => {
              let isFlag = false;
              if (item.id == getfmlbh) {
                if (item.children.length === 1) {
                  isFlag = true;
                }
                if (!isFlag) {
                  res.data.forEach((twoItem) => {
                    item.children.push({
                      ...twoItem,
                      datamode: "mulu",
                      show: false,
                      children: [],
                    });
                  });
                }
                if (this.isTmml) {
                  item.children.forEach((item2) => {
                    if (item2.label == this.isTmml) {
                      this.$refs.clTree.isTmml_Flag = true;
                    }
                  });
                }
              } else {
                res.data.forEach((twoItem) => {
                  this.clTreeData.forEach((item, index1) => {
                    item.children.forEach((item2, index2) => {
                      // if(item2.id==twoItem.id){
                      //   item2.children.push(twoItem)
                      // }
                      if (item.id == item2.parentId) {
                        if (item2.id == getfmlbh) {
                          item2.children = res.data;
                        }
                      }
                    });
                  });
                });
              }
            });
          } else {
            res.data.forEach((item) => {
              this.clTreeData.push({
                ...item,
                datamode: "juan",
                show: false,
                children: [],
              });
            });
          }
        });
    },
    expandClick(data) {
      this.jdlx = data.jdlx + 1;
      this.jdlxData = data;
      console.log("点击", data, this.jdlx);
    },
    clExpandClick(data) {
      // this.jdlx = data.jdlx + 1;
      this.jdlxData = data;
      console.log("点击", data);
    },
    updateMl(data){
      this.zcFmlbh=[]
      this.mlbh=''
      this.jdlx=1
    },
    // 前端缓存二级节点
    twoTreeData(value,val) {
      console.log("value---1", value);
      this.jdlx = val + 1;
      storage.setItem("mlbh", value);
      if (this.zcFmlbh.indexOf(value) === -1) {
        this.zcFmlbh.push(value);
        this.getTreeMl(value);
      }
    },
    // 前端缓存二级节点
    clTwoTreeData(value,val) {
      console.log("value---2", this.zcFmlbh);
      storage.setItem("mlbh", value);
      if(value!=undefined&&val.data.treeType=='jz'){
        this.clJbh=value
      }
      if(value!=undefined&&val.data.treeType=='cl'){
        this.clFlbm=value
      }else{
        this.clFlbm=''
      }
      if (this.zcFmlbh.indexOf(value) === -1) {
        this.zcFmlbh.push(value);
        this.clGetTreeMl(value);
      }
    },
    // 新增卷
    addtask() {
      this.generateUUID();
      if (this.uuid) {
        this.treeData.push({
          mlxsmc: "新增卷",
          jzbh: this.jzbh,
          mlbh: this.uuid,
          leaf: true,
          datamode: "juan",
          show: false,
          jdlx:1,
          children: [],
        });
        this.$nextTick(() => {
          this.$refs.spTree.editCase(this.uuid, "新增卷",null,1,this.jzbh);
        });
      }
    },
    // 上传卷
    uptask() {},
    // 前端生成uuid
    generateUUID() {
      let d = new Date().getTime();
      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      uuid = uuid.replace(/-/g, "");
      this.uuid = uuid;
    },
    async saveAndUpdate() {
      await saveAndUpdate({
        ...this.modulePerson,
        fmlbh: this.savefmlbh,
        jzbh: this.jzbh,
        mlbh: this.uuid,
        mlxsmc: this.$refs.spTree.selectInput,
      }).then((res) => {
        if (res.code == 0) {
          this.treeData.forEach((item) => {
            if (item.mlbh == this.uuid) {
              item.mlxsmc = this.$refs.spTree.selectInput;
            } else if (item.mlbh == this.savefmlbh) {
              item.children.forEach((item2) => {
                if (item2.mlbh == this.uuid) {
                  item2.mlxsmc = this.$refs.spTree.selectInput;
                }
              });
            }
          });
          // this.savefmlbh = "";
          // this.uuid = "";
          // this.$refs.spTree.getNode(0)
        }
      });
    },
    async clSaveAndUpdate() {
      await saveAndUpdate({
        ...this.modulePerson,
        fmlbh: this.savefmlbh,
        jzbh: this.jzbh,
        mlbh: this.uuid,
        mlxsmc: this.$refs.spTree.selectInput,
      }).then((res) => {
        if (res.code == 0) {
          this.treeData.forEach((item) => {
            if (item.mlbh == this.uuid) {
              item.mlxsmc = this.$refs.spTree.selectInput;
            } else if (item.mlbh == this.savefmlbh) {
              item.children.forEach((item2) => {
                if (item2.mlbh == this.uuid) {
                  item2.mlxsmc = this.$refs.spTree.selectInput;
                }
              });
            }
          });
          this.savefmlbh = "";
          this.uuid = "";
        }
      });
    },
    setMlbhId(value, value2) {
      console.log('value2-----',value2)
      this.uuid = value;
      this.savefmlbh = value2;
    },
    //重置卷
    jzczClick(data) {
      let params = {
        ...data,
      };
      dzjzmlReset(params).then((res) => {
        if (res.code == 0) {
          this.$message.success(res.msg);
          this.treeData = [];
          this.jdlx = 1;
          let ml = "";
          this.getTreeMl(ml);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除卷
    async dzjzmlDelete(value) {
      await dzjzmlDelete({ mlbh: value }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
        }
      });
    },
    // 新建目录
    saveMulu(value, datamode, jzbh) {
      this.treeData.forEach((item) => {
        if (item.mlbh == value) {
          if (datamode == "mulu") {
            this.generateUUID();
            if (this.uuid) {
              item.children.push({
                jzbh: jzbh,
                mlxsmc: "新增目录",
                mlbh: this.uuid,
                fmlbh: value,
                leaf: true,
                datamode: "mulu",
                show: false,
                jdlx:2
              });
              this.savefmlbh = value;
              this.$nextTick(() => {
                this.$refs.spTree.editCase(this.uuid, "新增目录", value);
              });
            }
          }
        }
      });
    },
    saveMuluTjml(value, datamode, jzbh, AddMlMc) {
      this.treeData.forEach((item) => {
        if (item.mlbh == value) {
          if (datamode == "mulu") {
            item.children.push({
              jzbh: jzbh,
              mlxsmc: AddMlMc,
              mlbh: "123",
              fmlbh: value,
              leaf: true,
              datamode: "mulu",
              show: false,
            });
          }
          this.$refs.spTree.selectInput = AddMlMc;
        }
      });
    },
    // 拖拽事件
    async MlDrag(mlbh, targetMlsxh) {
      await dzjzmlMlDrag({
        ...this.modulePerson,
        jzbh: this.jzbh,
        mlbh: mlbh,
        targetMlsxh: targetMlsxh,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "目录已更新",
          });
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
          resolve(md5);
        };
        reader.onerror = function (event) {
          reject(event.target.error);
        };
      });
    },
    // 上传前
    beforeUpload(file) {
      this.file = file;
      this.fileList.push(file);
      // this.identifier = this.identifierCreate();
    },
    // 上传文件的钩子函数
    uploadFunction(file) {
      this.calcMD5(file.file).then((res) => {
        this.md5 = res;
        this.isloading = true;
        // 每个文件切片大小定为5MB
        var sliceSize = 5 * 1024 * 1024;
        //文件大小限制为最大1个G，可根据需求修改
        var filesizes = 1 * 1024 * 1024 * 1024;
        let that = this;
        const blob = file.file;
        const fileSize = blob.size; // 文件大小
        const fileName = blob.name; // 文件名
        const fileType = blob.type; // 文件名
        //计算文件切片总数
        const totalSlice = Math.ceil(fileSize / sliceSize);
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
                if (resp.data == true) {
                  trueList.push({ flag: true });
                }
              }); //一个分片上传完成后再调用接口上传下一片
            }
            if (trueList.length == totalSlice) {
              // that.$message.success('文件上传成功')
              // that.showbtn = true;
              let data = {
                id: resp.data,
              };
              postWjhb(data).then((hbRes) => {
                if (hbRes.data == true) {
                  getMaxWjsxh({ mlbh: this.clickNode.fData.mlbh }).then(
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
                              tjlx: 1,
                            };
                            postWjtj(data).then((tjRes) => {
                              if (tjRes.data != null) {
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
                              tjlx: 1,
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
                          tjlx: 1,
                        };
                        postWjtj(data).then((tjRes) => {
                          if (tjRes.data != null) {
                            this.fileList = [];
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
    overExceed() {
      this.$message.warning("超出文件个数限制");
    },
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
    // 生成文件唯一标识符用
    identifierCreate() {
      let d = new Date().getTime();
      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      uuid = uuid.replace(/-/g, "");
      return uuid;
    },
    // 上传文件时生成文件唯一标识符的工具函数
    identifierCode(value) {
      // console.log(value, "根据传递进来的目录编号调取第二次接口");
    },
    // 树节点点击事件
    handleNodeClick(data, node) {
      if(data.fmlbh!=null){
        this.fmlbh=data.fmlbh
      }
      // this.$refs.spTree.getNode(node.parent.data.mlbh)
      console.log("点击", data, node);
      this.$store.commit("sbNode/SET_SB_NODE",data.mlbh )
      this.jdlx = data.jdlx + 1;
      if (data.jdlx == 3) {
        this.getJzmlwjInfo(
          node.parent.data.jzbh,
          node.parent.data.mlbh,
          node.parent,
          node.parent.data
        );
        this.clickObject = {
          jzbh: node.data.jzbh,
          mlbh: node.data.mlbh,
          fNode: node.parent,
          fData: node.parent.data,
        };
        this.mlClickFlag = 3;
        this.mlClickData = data;
      } else {
        if (data.fmlbh == null) {
          this.getJzmlwjInfo(node.data.jzbh, node.data.mlbh, node, data);
          this.clickObject = {
            jzbh: node.data.jzbh,
            mlbh: node.data.mlbh,
            fNode: node,
            fData: data,
          };
          localStorage.setItem("jbh", node.data.mlbh);
        } else {
          this.getJzmlwjInfo(
            node.data.jzbh,
            node.data.mlbh,
            node.parent,
            node.parent.data
          );
          this.clickObject = {
            jzbh: node.data.jzbh,
            mlbh: node.data.mlbh,
            fNode: node.parent,
            fData: node.parent.data,
          };
        }
      }
      // console.log(data, "节点点击");
      this.mlbh = data.mlbh;
      this.clickNode = node;
      let testData = Object.assign({}, this.clickNode);
      var cache = [];
      var aa = JSON.stringify(testData, function (key, value) {
        if (typeof value === "object" && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      });
      cache = null;
      localStorage.setItem("clickNode", aa);
      // console.log("clickObject----", this.clickObject);
      // console.log("clickNode----", this.clickNode);
    },
    // 材料树节点点击事件
    clHandleNodeClick(data, node) {
      console.log("点击", data, node);
      if(node.isLeaf!=true){
        return
      }
      if (data.parentId == null) {
          this.getClmlwjInfo(this.clJbh, node.data.id, node, data);
          // this.clickObject = {
          //   jzbh: node.data.jzbh,
          //   mlbh: node.data.mlbh,
          //   fNode: node,
          //   fData: data,
          // };
          localStorage.setItem("jbh", node.data.id);
        } else {
          this.getClmlwjInfo(
            this.clJbh,
            node.data.id,
            node.parent,
            node.parent.data
          );
          this.clickObject = {
            jzbh: this.clJbh,
            mlbh: node.data.id,
            fNode: node.parent,
            fData: node.parent.data,
          };
        }
      // console.log(data, "节点点击");
      this.mlClickFlag = 3;
      this.mlClickData = data;
      this.mlbh = data.mlbh;
      this.clickNode = node;
      let testData = Object.assign({}, this.clickNode);
      var cache = [];
      var aa = JSON.stringify(testData, function (key, value) {
        if (typeof value === "object" && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return;
          }
          cache.push(value);
        }
        return value;
      });
      cache = null;
      localStorage.setItem("clickNode", aa);
      // console.log("clickObject----", this.clickObject);
      // console.log("clickNode----", this.clickNode);
    },
    // 获取卷宗目录文件
    async getJzmlwjInfo(jzbh, mlbh, fNode, fData) {
        await getJzmlwjInfo({ jzbh, mlbh }).then((res) => {
        if (res.code == 0) {
          let imgData = [];
          res.data.forEach((item) => {
            imgData.push({
              ...item,
              showContextMenu: false,
              checked: false,
            });
          });
          if (this.mlClickFlag == 3) {
            this.$store.commit("mlList/SET_ML_LIST", this.mlClickData);
          }
          this.$emit("getImgs", imgData, fNode, fData, mlbh);
          // this.$message.success("获取目录文件成功");
        }
      });
    },
    // 获取材料目录文件
    async getClmlwjInfo(jzbh, mlbh, fNode, fData) {
      let data={
        jzbh: this.jzbh,
        jbh: this.clJbh,
        flbm:mlbh,
      }
      await getClflwjInfo(data).then((res) => {
        if (res.code == 0) {
          let imgData = [];
          res.data.forEach((item) => {
            imgData.push({
              ...item,
              showContextMenu: false,
              checked: false,
            });
          });
          if (this.mlClickFlag == 3) {
            this.$store.commit("mlList/SET_ML_LIST", this.mlClickData);
          }
          this.$emit("getImgs", imgData, fNode, fData, mlbh);
          // this.$message.success("获取目录文件成功");
        }
      });
    },
    // 添加目录文件
    saveAddMulu(val, val2, val3, val4) {
      this.$refs.spTree.addCaseTjml(val2, val3, val4);
      let DataId = [];
      val.forEach((item) => {
        DataId.push(item.wjxh);
      });
      setTimeout(() => {
        this.addMlFile(DataId, val4, val3);
      }, 100);
    },
    // 添加目录文件-接口
    async addMlFile(DataId, val4, val3) {
      await addMlFile({
        ...this.modulePerson,
        wjxhList: DataId,
        mlxsmc: val4,
      }).then((res) => {
        if (res.code == 0) {
          this.treeData.forEach((item) => {
            if (item.mlbh == val3.mlbh) {
              item.children[res.data.mlsxh - 1].mlbh = res.data.mlbh;
            }
          });
          // this.$refs.spTree.getNode(this.fmlbh)
          this.$message.success("添加目录文件成功");
          this.$emit("setEmpty");
        }
      });
    },
    // 添加封面目录
    saveAddFmMl(val, val2, val3, val4) {
      let isFm = false;
      this.isTmml = val4;
      // val3.children.forEach((item) => {
      //   if (item.mlxsmc == val4) {
      //     isFm = true;
      //   }
      // });
      // if (isFm) {
      // } else {
      //   this.$refs.spTree.addCaseFmMl(val2, val3, val4);
      // }
      this.$refs.spTree.addCaseFmMl(val2, val3, val4);
      if (val4 == "封面") {
        let DataId = [];
        val.forEach((item) => {
          DataId.push(item.wjxh);
        });
        setTimeout(() => {
          this.addFm(DataId, val3, isFm);
        }, 100);
      } else if (val4 == "目录") {
        let DataId = [];
        val.forEach((item) => {
          DataId.push(item.wjxh);
        });
        setTimeout(() => {
          this.addMl(DataId, val3, isFm);
        }, 100);
      } else if (val4 == "备考表") {
        let DataId = [];
        val.forEach((item) => {
          DataId.push(item.wjxh);
        });
        setTimeout(() => {
          this.addBkb(DataId, val3, isFm);
        }, 100);
      } else if (val4 == "封底") {
        let DataId = [];
        val.forEach((item) => {
          DataId.push(item.wjxh);
        });
        setTimeout(() => {
          this.addFd(DataId, val3, isFm);
        }, 100);
      }
    },
    // 添加封面目录-接口
    async addFm(DataId, val3, isFm) {
      await addFm({
        ...this.modulePerson,
        wjxhList: DataId,
      }).then((res) => {
        if (res.code == 0) {
          if (!isFm) {
            this.treeData.forEach((item) => {
              if (item.mlbh == val3.mlbh) {
                item.children[item.children.length - 1].mlbh = res.data.mlbh;
              }
            });
          }
          // this.$refs.spTree.getNode(this.fmlbh)
          this.$message.success("添加封面文件成功");
          this.$emit("setEmpty");
        }
      });
      // console.log("封面");
    },
    // 添加目录-接口
    async addMl(DataId, val3, isFm) {
      await addMl({
        ...this.modulePerson,
        wjxhList: DataId,
      }).then((res) => {
        if (res.code == 0) {
          if (!isFm) {
            this.treeData.forEach((item) => {
              if (item.mlbh == val3.mlbh) {
                item.children[item.children.length - 1].mlbh = res.data.mlbh;
              }
            });
          }
          // this.$refs.spTree.getNode(this.fmlbh)
          this.$message.success("添加目录文件成功");
          this.$emit("setEmpty");
        }
      });
      // console.log("目录");
    },
    // 添加备考表-接口
    async addBkb(DataId, val3, isFm) {
      await addBkb({
        ...this.modulePerson,
        wjxhList: DataId,
      }).then((res) => {
        if (res.code == 0) {
          if (!isFm) {
            this.treeData.forEach((item) => {
              if (item.mlbh == val3.mlbh) {
                item.children[item.children.length - 1].mlbh = res.data.mlbh;
              }
            });
          }
          // this.$refs.spTree.getNode(this.fmlbh)
          this.$message.success("添加备考表文件成功");
          this.$emit("setEmpty");
        }
      });
    },
    // 添加封底-接口
    async addFd(DataId, val3, isFm) {
      await addFd({
        ...this.modulePerson,
        wjxhList: DataId,
      }).then((res) => {
        if (res.code == 0) {
          if (!isFm) {
            this.treeData.forEach((item) => {
              if (item.mlbh == val3.mlbh) {
                item.children[item.children.length - 1].mlbh = res.data.mlbh;
              }
            });
          }
          this.$message.success("添加封底文件成功");
          // this.$refs.spTree.getNode(this.fmlbh)
          this.$emit("setEmpty");
        }
      });
    },
    // handleCheckChange() {},
    // // 新增目录
    // addList(data, node) {
    //   console.log("新增", node, data);
    //   let arr = [];
    //   arr.push({ label: "新增卷", mlbh: "111" });
    //   data.children = arr;
    //   console.log(this.treeData, "树节点数据");
    //   node.childNodes = arr;
    // },
    // // 编辑目录
    // editList(data) {
    //   this.$refs.spTree.selectInputId = data.id;
    //   this.$nextTick(() => {
    //     this.$refs.spTree.focus();
    //   });
    //   console.log("编辑");
    // },
    // // 移入树节点
    // nodeEnter(data) {
    //   console.log(123);
    //   this.$set(data, "edit", true);
    // },
    // // 移除树节点
    // nodeLeave(data) {
    //   this.$set(data, "edit", false);
    // },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-upload-dragger {
  width: 100%;
  height: 40px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-icon-upload {
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  .el-icon-upload:before {
    width: 20px !important;
    height: 20px !important;
  }
}
.tree-title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  padding: 10px 18px;
  padding-bottom: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .left-name {
    min-width: 86px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    font-weight: 500;
    margin-left: 14px;
  }
  /deep/ .el-input__inner {
    border: 0px;
    width: 130px;
  }
}
.tree-select {
  width: 100%;
  padding: 10px 16px;
  padding-bottom: 0px;
}
.treebody {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .header {
    width: 100%;
    height: 45px;
    line-height: 45px;
    display: flex;
    // border-bottom: 1px solid #a9c4df;
    padding-top: 0px;
    display: flex;
    justify-content: space-between;
    /deep/.el-button {
      color: #1890ff !important;
      white-space: nowrap;
      font-size: 16px !important;
      height: 25px;
      //   line-height: 7px;
      margin-left: 10px;
      margin-right: 5px;
      padding-right: 2px;
      padding-left: 2px;
      padding-top: 5px;
      border: 1px solid transparent;
      &:hover {
        border: 1px solid rgb(220, 223, 230);
      }
    }
  }
  /deep/.el-upload--text {
    width: 100%;
    height: 100%;
  }
  /deep/.el-upload-dragger {
    width: 100%;
    height: 100%;
  }
  .content {
    padding: 5px 0;
    overflow: auto;
    height: calc(82%);
    margin-bottom: 42px;
  }
  .bottom {
    position: relative;
    // height: 110px;
    // background: rgba(149, 149, 149, 0.1);
    .upload {
      padding: 0 5px;
      margin: 10px;
      line-height: 40px;
      border: 1px dashed #a9c4df;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      clear: both;
      font-size: 14px;
      color: #879bba;
      box-sizing: border-box;
      .el-icon-upload2 {
        font-size: 16px;
        color: #0037ff;
      }
    }
    ul {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: rgba(149, 149, 149, 0.1);
      font-size: 14px;
      color: #4f5e7b;
      box-sizing: border-box;
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        float: left;
        width: 50%;
        padding-left: 15px;
        line-height: 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
/deep/ .loadAlert {
  width: 300px;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  z-index: 2000;
}
/deep/.el-loading-mask {
  background-color: #fdf6ec;
}
/deep/.el-loading-spinner {
  top: 22px;
  i {
    color: #e6a23c;
  }
}
/deep/.el-tree-node__content {
  color: #1890ff !important;
  font-size: 16px !important;
  height: 32px !important;
}
.lefttext {
  color: #4f5e7b;
}
.is-current {
  .lefttext {
    color: #4f5e7b !important;
  }
}
</style>