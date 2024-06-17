"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  clFlag: ''
};
var mutations = {
  SET_CL_FLAG: function SET_CL_FLAG(state, val) {
    state.clFlag = val;
  }
};
var actions = {
  setClFlag: function setClFlag(_ref, val) {
    var commit = _ref.commit;
    commit('SET_CL_FLAG', val); // Cookies.set('imgList', list)
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;