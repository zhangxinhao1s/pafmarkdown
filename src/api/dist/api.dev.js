"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserInfo = void 0;

var _request = require("@/network/request");

var SERVE = '/szjz';

var getUserInfo = function getUserInfo(data) {
  return (0, _request.post)("".concat(SERVE, "/tyyw/getUserInfo"), data);
};

exports.getUserInfo = getUserInfo;