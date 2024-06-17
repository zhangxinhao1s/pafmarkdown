"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jzjbxxJcsd = exports.updateJzjbxx = exports.deleteJzjbxx = exports.bdJzjbxx = exports.getBdajList = exports.batchAddJzjbxx = exports.pageJzjbxx = exports.getDzzjzList = exports.getDzjzAjlb = exports.getUserInfo = exports.getDwbmList = void 0;

var _request = require("@/network/request");

// import request from "@/utils/request.js";
var getDwbmList = function getDwbmList() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/tyyw/getDwbmInfo", data);
}; //查询用户信息


exports.getDwbmList = getDwbmList;

var getUserInfo = function getUserInfo() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/tyyw/getUserInfo", data);
}; //查询案件类别


exports.getUserInfo = getUserInfo;

var getDzjzAjlb = function getDzjzAjlb() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/tyyw/getDzjzAjlb", data);
}; //查询卷宗列表


exports.getDzjzAjlb = getDzjzAjlb;

var getDzzjzList = function getDzzjzList() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/tyyw/getDzzjzList", data);
}; //分页查询电子卷宗


exports.getDzzjzList = getDzzjzList;

var pageJzjbxx = function pageJzjbxx() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/szjzgl/jzjbxx/pageJzjbxx", data);
}; //添加2.0卷宗


exports.pageJzjbxx = pageJzjbxx;

var batchAddJzjbxx = function batchAddJzjbxx() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/szjzgl/jzjbxx/batchAddJzjbxx", data);
}; ///tyyw/getBdajList查询待绑定列表


exports.batchAddJzjbxx = batchAddJzjbxx;

var getBdajList = function getBdajList() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/tyyw/getBdajList", data);
}; //绑定卷宗/szjzgl/jzjbxx/bdJzjbxx


exports.getBdajList = getBdajList;

var bdJzjbxx = function bdJzjbxx() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/szjzgl/jzjbxx/bdJzjbxx", data);
}; //删除卷宗​/szjzgl​/jzjbxx​/deleteJzjbxx


exports.bdJzjbxx = bdJzjbxx;

var deleteJzjbxx = function deleteJzjbxx() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/szjzgl/jzjbxx/deleteJzjbxx", data);
}; //编辑卷宗/szjzgl/jzjbxx/updateJzjbxx


exports.deleteJzjbxx = deleteJzjbxx;

var updateJzjbxx = function updateJzjbxx() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/szjzgl/jzjbxx/updateJzjbxx", data);
}; //编辑卷宗/szjzgl/jzjbxx/updateJzjbxx


exports.updateJzjbxx = updateJzjbxx;

var jzjbxxJcsd = function jzjbxxJcsd() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _request.post)("/szjz/szjzgl/jzjbxx/jcsd", data);
};

exports.jzjbxxJcsd = jzjbxxJcsd;