"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  imgList: []
};
var mutations = {
  SET_IMG_LIST: function SET_IMG_LIST(state, list) {
    state.imgList = list;
  }
};
var actions = {
  setImgList: function setImgList(_ref, list) {
    var commit = _ref.commit;
    commit('SET_IMG_LIST', list); // Cookies.set('imgList', list)
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;