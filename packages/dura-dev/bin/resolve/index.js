"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _extensions = _interopRequireDefault(require("./extensions"));

var _alias = _interopRequireDefault(require("./alias"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(userConfig) {
  var _userConfig$extension = userConfig.extensions,
      extensions = _userConfig$extension === void 0 ? [] : _userConfig$extension,
      _userConfig$alias = userConfig.alias,
      alias = _userConfig$alias === void 0 ? {} : _userConfig$alias;
  return {
    extensions: (0, _extensions.default)(extensions),
    alias: (0, _alias.default)(alias)
  };
}