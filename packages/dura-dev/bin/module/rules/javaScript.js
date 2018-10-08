"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../../config");

var _default = {
  test: /\.js|.jsx$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader",
    options: _config.babelConfig
  }
};
exports.default = _default;