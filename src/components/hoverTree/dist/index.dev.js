"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hoverTree = _interopRequireDefault(require("./hoverTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var treePlugin = {
  install: function install(vue) {
    // 注册全局组件
    vue.component(_hoverTree["default"].name, _hoverTree["default"]);
  }
};
var _default = treePlugin;
exports["default"] = _default;