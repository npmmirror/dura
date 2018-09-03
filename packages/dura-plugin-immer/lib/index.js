"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immer = _interopRequireDefault(require("immer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  namespace: '@@duraImmer',
  onReducer: function onReducer(reducer) {
    return function (state, action) {
      return (0, _immer.default)(state, function (draft) {
        return reducer(draft, action);
      });
    };
  }
};
exports.default = _default;