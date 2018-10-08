"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbsPath = getAbsPath;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currPath = process.cwd();

function getAbsPath(targetPath) {
  return _path.default.join(currPath, targetPath);
}