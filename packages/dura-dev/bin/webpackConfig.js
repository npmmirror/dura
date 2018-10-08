"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = require("./util");

var _resolve = _interopRequireDefault(require("./resolve"));

var _module = _interopRequireDefault(require("./module"));

var _plugins = _interopRequireDefault(require("./plugins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(userConfig) {
  var entry = userConfig.entry,
      outDir = userConfig.outDir;
  return {
    mode: 'production',
    entry: (0, _util.getAbsPath)(entry),
    stats: "errors-only",
    output: {
      filename: 'bundle-[hash:8].js',
      path: (0, _util.getAbsPath)(outDir)
    },
    resolve: (0, _resolve.default)(userConfig),
    module: (0, _module.default)(userConfig),
    plugins: (0, _plugins.default)(userConfig)
  };
}