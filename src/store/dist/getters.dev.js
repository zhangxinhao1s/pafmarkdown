"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  sidebar: function sidebar(state) {
    return state.app.sidebar;
  },
  userInfo: function userInfo(state) {
    return state.user.userInfo;
  },
  qyInfo: function qyInfo(state) {
    return state.user.qyInfo;
  },
  tokenInfo: function tokenInfo(state) {
    return state.user.tokenInfo;
  },
  aesKeyInfo: function aesKeyInfo(state) {
    return state.user.aesKeyInfo;
  },
  headImg: function headImg(state) {
    return state.head.headImg;
  },
  imgList: function imgList(state) {
    return state.imgList.imgList;
  },
  mlList: function mlList(state) {
    return state.mlList.mlList;
  },
  wjscFlag: function wjscFlag(state) {
    return state.wjsc.wjscFlag;
  },
  sbNode: function sbNode(state) {
    return state.sbNode.sbNode;
  },
  clFlag: function clFlag(state) {
    return state.clFlag.clFlag;
  },
  setUndoTotal: function setUndoTotal(state) {
    return state.head.setUndoTotal;
  },
  plusUndoTotal: function plusUndoTotal(state) {
    return state.head.plusUndoTotal;
  },
  setDoneClueId: function setDoneClueId(state) {
    return state.head.setDoneClueId;
  }
};
exports["default"] = _default;