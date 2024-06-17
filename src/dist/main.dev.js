"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

var _elementUi = _interopRequireDefault(require("element-ui"));

require("element-ui/lib/theme-chalk/index.css");

var _axios = _interopRequireDefault(require("axios"));

var _qs = _interopRequireDefault(require("qs"));

var _moment = _interopRequireDefault(require("moment"));

require("./assets/iconfont/iconfont.css");

require("./components");

require("./styles/base.less");

var _auth = _interopRequireDefault(require("./directives/auth"));

var _vueContextmenu = _interopRequireDefault(require("vue-contextmenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//自定义组件全局注册
_vue["default"].use(_vueContextmenu["default"]);

_vue["default"].use(_elementUi["default"], {
  size: 'small'
}); // Vue.use(ElementUI);


_vue["default"].prototype.$EventBus = new _vue["default"]();
_vue["default"].prototype.$axios = _axios["default"]; //全局注册，使用方法为:this.$axios

_vue["default"].prototype.qs = _qs["default"]; //全局注册，使用方法为:this.qs

_vue["default"].config.productionTip = false;
_vue["default"].prototype.$moment = _moment["default"];

_vue["default"].use(_auth["default"]); //按钮权限检验指令


new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');