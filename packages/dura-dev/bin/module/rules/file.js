"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  test: /\.(png|jpg|gif)$/,
  use: [{
    loader: 'file-loader',
    options: {}
  }]
};
exports.default = _default;