"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "recursiveEnhanceFun", {
  enumerable: true,
  get: function get() {
    return _recursive.default;
  }
});
Object.defineProperty(exports, "objectReduce", {
  enumerable: true,
  get: function get() {
    return _reduce.objectReduce;
  }
});
Object.defineProperty(exports, "arrayReduce", {
  enumerable: true,
  get: function get() {
    return _reduce.arrayReduce;
  }
});

var _recursive = _interopRequireDefault(require("./recursive"));

var _reduce = require("./reduce");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }