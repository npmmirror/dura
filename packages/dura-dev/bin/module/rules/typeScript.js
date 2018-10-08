"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../../config");

var _default = {
  test: /\.ts|.tsx?$/,
  loader: 'awesome-typescript-loader',
  options: {
    useBabel: true,
    useCache: true,
    babelCore: "@babel/core",
    babelOptions: _config.babelConfig
  }
};
exports.default = _default;