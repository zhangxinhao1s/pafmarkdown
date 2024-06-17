"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  wjscFlag: ''
};
var mutations = {
  SET_WJSC_FLAG: function SET_WJSC_FLAG(state, val) {
    state.wjscFlag = val;
  }
};
var actions = {
  setWjscFlag: function setWjscFlag(_ref, val) {
    var commit = _ref.commit;
    commit('SET_WJSC_FLAG', val); // Cookies.set('imgList', list)
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;