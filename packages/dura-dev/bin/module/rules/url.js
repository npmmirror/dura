"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  test: /\.(png|jpg|gif)$/i,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 8192
    }
  }]
};
exports.default = _default;