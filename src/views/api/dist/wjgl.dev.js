"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportDzjzPdf = exports.getExportTask = exports.batchDeleteScTask = exports.getTaskList = exports.setJzzzwc = exports.batchDeleteTask = exports.mlwjDrag = exports.getImportDataSource = exports.getAjly = exports.mlwjLxy = exports.mlwjJump = exports.missCode = exports.addFd = exports.addBkb = exports.addMl = exports.getJzmlJbxx = exports.getClflwjInfo = exports.getClflmlTree = exports.addFm = exports.mlMoving = exports.addMlFile = exports.getJzmlwjInfo = exports.Wjprocess = exports.pdfReady = exports.uploadFile = exports.dzjzmlMlDrag = exports.dzjzmlDelete = exports.saveAndUpdate = exports.importAjList = exports.getTreeMl = exports.CaseProduct = exports.deleteCase = exports.bingCase = exports.getBindCaseList = exports.addJz = exports.addCase = exports.getCaseList = exports.zzDzjz = exports.getJzjbxx = exports.heavyCode = exports.dzjzmlReset = exports.getDictOptions = exports.clflDelete = exports.clflAdd = exports.clflPageQuery = exports.tzclflPost = exports.getMaxWjsxh = exports.postWjtj = exports.yzpdfsfjm = exports.postWjhb = exports.postWjsc = exports.getJcwjfp = void 0;

var _request = require("@/network/request");

var _uploadUtil = require("@/network/uploadUtil");

var SERVE = '/szjz';
var SERVE2 = '/fzba';
var biz = '/base'; //检察文件是否分片

var getJcwjfp = function getJcwjfp(data) {
  return (0, _request.post)("".concat(SERVE, "/wj/jcwjfp"), data);
}; //分片上传


exports.getJcwjfp = getJcwjfp;

var postWjsc = function postWjsc(data) {
  return (0, _request.post)("".concat(SERVE, "/wj/wjsc"), data);
}; //文件分片合并/wj/wjhb


exports.postWjsc = postWjsc;

var postWjhb = function postWjhb(data) {
  return (0, _request.post)("".concat(SERVE, "/wj/wjhb"), data);
}; //验证pdf文件是否加密


exports.postWjhb = postWjhb;

var yzpdfsfjm = function yzpdfsfjm(data) {
  return (0, _request.post)("".concat(SERVE, "/wj/yzpdfsfjm"), data);
}; //文件上传提交


exports.yzpdfsfjm = yzpdfsfjm;

var postWjtj = function postWjtj(data) {
  return (0, _request.post)("".concat(SERVE, "/wj/wjtj"), data);
}; //查询最大顺序号/dzjzmlwj/getMaxWjsxh


exports.postWjtj = postWjtj;

var getMaxWjsxh = function getMaxWjsxh(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/getMaxWjsxh"), data);
}; //修改材料分类名称


exports.getMaxWjsxh = getMaxWjsxh;

var tzclflPost = function tzclflPost(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/tzclfl"), data);
}; //获取材料分类


exports.tzclflPost = tzclflPost;

var clflPageQuery = function clflPageQuery(data) {
  return (0, _request.post)("".concat(SERVE2, "/dzjz/clxx/page_query"), data);
}; //添加材料分类


exports.clflPageQuery = clflPageQuery;

var clflAdd = function clflAdd(data) {
  return (0, _request.post)("".concat(SERVE2, "/dzjz/clxx/add"), data);
}; //删除材料分类


exports.clflAdd = clflAdd;

var clflDelete = function clflDelete(data) {
  return (0, _request.post)("".concat(SERVE2, "/dzjz/clxx/delete"), data);
}; // ----------外部接口


exports.clflDelete = clflDelete;

var getDictOptions = function getDictOptions(data) {
  return (0, _request.get)("".concat(biz, "/dict/getDictOptions"), data);
}; // ----------外卷接口
//重置卷


exports.getDictOptions = getDictOptions;

var dzjzmlReset = function dzjzmlReset(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/reset"), data);
}; //设置重码


exports.dzjzmlReset = dzjzmlReset;

var heavyCode = function heavyCode(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/heavyCode"), data);
}; //查询卷宗基本信息/szjzgl/jzjbxx/getJzjbxx


exports.heavyCode = heavyCode;

var getJzjbxx = function getJzjbxx(data) {
  return (0, _request.post)("".concat(SERVE, "/szjzgl/jzjbxx/getJzjbxx"), data);
}; //卷宗制作


exports.getJzjbxx = getJzjbxx;

var zzDzjz = function zzDzjz(data) {
  return (0, _request.post)("".concat(SERVE, "/szjzgl/jzjbxx/zzDzjz"), data);
}; // 外眷管理查询（含部门受案号故使用post）


exports.zzDzjz = zzDzjz;

var getCaseList = function getCaseList(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/getCaseList"), data);
}; // 新增案件


exports.getCaseList = getCaseList;

var addCase = function addCase(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/addAj"), data);
}; // 添加卷宗/szjzgl/jzjbxx/addJzjbxx


exports.addCase = addCase;

var addJz = function addJz(data) {
  return (0, _request.post)("".concat(SERVE, "/szjzgl/jzjbxx/addJzjbxx"), data);
}; // 待绑定案件列表查询


exports.addJz = addJz;

var getBindCaseList = function getBindCaseList(data) {
  return (0, _request.get)("".concat(SERVE, "/dzjz/getBdajList"), data);
}; // 绑定案件


exports.getBindCaseList = getBindCaseList;

var bingCase = function bingCase(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/bdAj"), data);
}; // 删除案件


exports.bingCase = bingCase;

var deleteCase = function deleteCase(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/deleteAj"), data);
}; // 卷宗制作


exports.deleteCase = deleteCase;

var CaseProduct = function CaseProduct(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/zzDzjz"), data);
}; // 卷宗目录


exports.CaseProduct = CaseProduct;

var getTreeMl = function getTreeMl(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/getTreeMl"), data);
}; // 导入2.0


exports.getTreeMl = getTreeMl;

var importAjList = function importAjList(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/importAjList"), data);
}; // 添加或修改卷宗目录


exports.importAjList = importAjList;

var saveAndUpdate = function saveAndUpdate(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/saveAndUpdate"), data);
}; // 删除卷宗目录


exports.saveAndUpdate = saveAndUpdate;

var dzjzmlDelete = function dzjzmlDelete(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/delete"), data);
}; // 删除卷宗目录


exports.dzjzmlDelete = dzjzmlDelete;

var dzjzmlMlDrag = function dzjzmlMlDrag(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/mlDrag"), data);
}; // 上传文件接口


exports.dzjzmlMlDrag = dzjzmlMlDrag;

var uploadFile = function uploadFile(data) {
  return (0, _uploadUtil.upload)("".concat(SERVE, "/wj/jcwjfp"), data);
}; // export const uploadFile = (data, callback) => upload(`${SERVE}/wjscrw/upload`, data, callback);
// 验证pdf


exports.uploadFile = uploadFile;

var pdfReady = function pdfReady(data) {
  return (0, _request.post)("".concat(SERVE, "/wj/yzpdfmm"), data);
}; // 上传文件验证


exports.pdfReady = pdfReady;

var Wjprocess = function Wjprocess(data) {
  return (0, _request.post)("".concat(SERVE, "/wjscrw/process"), data);
}; // 获取卷宗目录文件


exports.Wjprocess = Wjprocess;

var getJzmlwjInfo = function getJzmlwjInfo(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/getJzmlwjInfo"), data);
}; // 添加目录文件


exports.getJzmlwjInfo = getJzmlwjInfo;

var addMlFile = function addMlFile(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/addMlFile"), data);
}; // 移动至其他目录


exports.addMlFile = addMlFile;

var mlMoving = function mlMoving(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/mlwjAdjust"), data);
}; // 添加封面


exports.mlMoving = mlMoving;

var addFm = function addFm(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/addFm"), data);
}; //查询材料分类目录


exports.addFm = addFm;

var getClflmlTree = function getClflmlTree(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/getClflmlTree"), data);
}; //查询材料分类目录数据/dzjzmlwj/getClflwjInfo


exports.getClflmlTree = getClflmlTree;

var getClflwjInfo = function getClflwjInfo(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/getClflwjInfo"), data);
}; //查询卷宗目录基本信息/dzjzml​/getJzmlJbxx


exports.getClflwjInfo = getClflwjInfo;

var getJzmlJbxx = function getJzmlJbxx(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/getJzmlJbxx"), data);
}; // 添加目录


exports.getJzmlJbxx = getJzmlJbxx;

var addMl = function addMl(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/addMl"), data);
}; // 生成备考表


exports.addMl = addMl;

var addBkb = function addBkb(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/addBkb"), data);
}; // 生成封底


exports.addBkb = addBkb;

var addFd = function addFd(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzml/addFd"), data);
}; // 设置漏码


exports.addFd = addFd;

var missCode = function missCode(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/missCode"), data);
}; // 设置跳码


exports.missCode = missCode;

var mlwjJump = function mlwjJump(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/mlwjJump"), data);
}; // 设置连续页


exports.mlwjJump = mlwjJump;

var mlwjLxy = function mlwjLxy(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/mlwjLxy"), data);
}; // 获取案件来源


exports.mlwjLxy = mlwjLxy;

var getAjly = function getAjly(data) {
  return (0, _request.get)("".concat(SERVE, "/dzjz/getAjly"), data);
}; // 获取导入案件接口状态


exports.getAjly = getAjly;

var getImportDataSource = function getImportDataSource(data) {
  return (0, _request.get)("".concat(SERVE, "/dzjz/getImportDataSource"), data);
}; // 卷宗文件拖动


exports.getImportDataSource = getImportDataSource;

var mlwjDrag = function mlwjDrag(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/mlwjDrag"), data);
}; // 卷宗文件删除


exports.mlwjDrag = mlwjDrag;

var batchDeleteTask = function batchDeleteTask(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjzmlwj/batchDeleteTask"), data);
}; // 制作完成


exports.batchDeleteTask = batchDeleteTask;

var setJzzzwc = function setJzzzwc(data) {
  return (0, _request.post)("".concat(SERVE, "/szjzgl/jzjbxx/jzzzwc"), data);
}; // 获取上传任务


exports.setJzzzwc = setJzzzwc;

var getTaskList = function getTaskList(data) {
  return (0, _request.post)("".concat(SERVE, "/szjzgl/wjscjl/page"), data);
}; // 批次删除上传任务


exports.getTaskList = getTaskList;

var batchDeleteScTask = function batchDeleteScTask(data) {
  return (0, _request.post)("".concat(SERVE, "/wjscrw/batchDeleteScTask"), data);
}; // 获取导出列表


exports.batchDeleteScTask = batchDeleteScTask;

var getExportTask = function getExportTask(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/getExportTask"), data);
}; // 导出PDF接口


exports.getExportTask = getExportTask;

var exportDzjzPdf = function exportDzjzPdf(data) {
  return (0, _request.post)("".concat(SERVE, "/dzjz/exportDzjzPdf"), data);
};

exports.exportDzjzPdf = exportDzjzPdf;