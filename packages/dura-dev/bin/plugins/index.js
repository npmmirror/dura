"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _getDefinePlugin = _interopRequireDefault(require("./getDefinePlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(userConfig) {
  return [(0, _getDefinePlugin.default)(userConfig)];
}