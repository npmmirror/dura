"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _typeScript = _interopRequireDefault(require("./typeScript"));

var _javaScript = _interopRequireDefault(require("./javaScript"));

var _css = _interopRequireDefault(require("./css"));

var _file = _interopRequireDefault(require("./file"));

var _url = _interopRequireDefault(require("./url"));

require("style-loader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(userConfig) {
  return [_css.default, _file.default, _url.default, _javaScript.default, _typeScript.default];
}