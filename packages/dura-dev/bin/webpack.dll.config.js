"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var DllPlugin = _webpack.default.DllPlugin;

function getWebpackDllConfig(_ref) {
  var _ref$dll = _ref.dll,
      dll = _ref$dll === void 0 ? [] : _ref$dll;
  return {
    entry: {
      vendor: [].concat(_toConsumableArray(dll))
    },
    output: {
      path: _path.default.join(process.cwd(), ".dura"),
      filename: "[name].dll.js",
      library: "[name]"
    },
    plugins: [new DllPlugin({
      context: process.cwd(),
      path: ".dura/[name]-manifest.json",
      name: "[name]"
    })]
  };
}

var _default = getWebpackDllConfig;
exports.default = _default;