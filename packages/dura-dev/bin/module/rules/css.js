"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  test: /\.css$/,
  use: [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader'
  }]
};
exports.default = _default;