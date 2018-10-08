"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultDefine = {};

function _default(userConfig) {
  var DefinePlugin = _webpack.default.DefinePlugin;
  var define = userConfig.define;

  var newDefine = _objectSpread({}, defaultDefine, define);

  return new DefinePlugin(Object.keys(newDefine).map(function (k) {
    return _defineProperty({}, k, JSON.stringify(newDefine[k]));
  }).reduce(function (prev, next) {
    return _objectSpread({}, prev, next);
  }, {}));
}