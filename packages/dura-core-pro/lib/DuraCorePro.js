"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _duraCore = require("dura-core");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOps = {
  initialModels: [],
  middleware: [],
  enhancers: [],
  plugins: []
};

function _default() {
  var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOps;
  var duraCorePro = {
    plugins: ops.plugins,
    initialModels: ops.initialModels,
    addModels: function addModels() {
      return false;
    },
    delModels: function delModels() {
      return false;
    },
    clear: function clear() {
      return false;
    },
    destroy: function destroy() {
      return false;
    }
  };
  var duraCore = (0, _duraCore.createDuraCore)({
    models: ops.initialModels
  });
  return _objectSpread({}, duraCorePro, duraCore);
}