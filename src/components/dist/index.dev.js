"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _SPDialog = _interopRequireDefault(require("./SPDialog"));

var _SPPagination = _interopRequireDefault(require("./SPPagination"));

var _SPQueryForm = _interopRequireDefault(require("./SPQueryForm"));

var _SPUpload = _interopRequireDefault(require("./SPUpload"));

var _SPTable = _interopRequireDefault(require("./SPTable"));

var _SPTree = _interopRequireDefault(require("./SPTree"));

var _CDTree = _interopRequireDefault(require("./CDTree"));

var _SPStaticTable = _interopRequireDefault(require("./SPStaticTable"));

var _SPPageHeader = _interopRequireDefault(require("./SPPageHeader"));

var _SPChart = _interopRequireDefault(require("./SPChart"));

var _SPAuth = _interopRequireDefault(require("./SPAuth"));

var _CLTree = _interopRequireDefault(require("./CLTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var GlobalComponents = [_SPDialog["default"], _SPPagination["default"], _SPQueryForm["default"], _SPUpload["default"], _SPTable["default"], _SPTree["default"], _CDTree["default"], _SPStaticTable["default"], _SPPageHeader["default"], _SPChart["default"], _SPAuth["default"], _CLTree["default"]];
GlobalComponents.forEach(function (item) {
  _vue["default"].use(item);
});