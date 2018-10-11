"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function getBabelConfig(_ref) {
  _objectDestructuringEmpty(_ref);

  return {
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
}

var _default = getBabelConfig;
exports.default = _default;