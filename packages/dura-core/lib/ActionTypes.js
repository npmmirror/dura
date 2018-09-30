"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  CANCEL: "@@duraCore/cancel".concat(randomString()),
  PLUS_COUNT: "@@duraCore/reducers/plusCount".concat(randomString())
};
var _default = ActionTypes;
exports.default = _default;