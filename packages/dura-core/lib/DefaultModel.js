"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ActionTypes = _interopRequireDefault(require("./ActionTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  namespace: "@@duraCore",
  initialState: 0,
  reducers: _defineProperty({}, _ActionTypes.default.PLUS_COUNT.split('/').reverse()[0], function (state) {
    return state + 1;
  })
};
exports.default = _default;