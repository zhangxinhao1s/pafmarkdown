"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  mlList: []
};
var mutations = {
  SET_ML_LIST: function SET_ML_LIST(state, list) {
    state.mlList = list;
  }
};
var actions = {
  setMlList: function setMlList(_ref, list) {
    var commit = _ref.commit;
    commit('SET_ML_LIST', list); // Cookies.set('imgList', list)
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;