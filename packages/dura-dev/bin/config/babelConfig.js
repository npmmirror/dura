"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  presets: [["@babel/preset-env", {
    targets: "> 0.25%, not dead"
  }]],
  plugins: ["@babel/plugin-transform-react-jsx", ["@babel/plugin-transform-runtime", {
    corejs: false,
    helpers: false,
    regenerator: true,
    useESModules: false
  }]]
};
exports.default = _default;