"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = {
  sbNode: ''
};
var mutations = {
  SET_SB_NODE: function SET_SB_NODE(state, val) {
    state.sbNode = val;
  }
};
var actions = {
  setSbNode: function setSbNode(_ref, val) {
    var commit = _ref.commit;
    commit('SET_SB_NODE', val); // Cookies.set('imgList', list)
  }
};
var _default = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
exports["default"] = _default;