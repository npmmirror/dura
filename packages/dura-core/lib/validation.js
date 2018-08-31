"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateModel = validateModel;

var _invariant = _interopRequireDefault(require("invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelSign = '[dura.core.model]';

function validateModel(model, modelList) {
  var namespace = model.namespace; //必须有namespace

  (0, _invariant.default)(namespace, "".concat(modelSign, " namespace should be defined")); //必须是string类型

  (0, _invariant.default)(typeof namespace === 'string', "".concat(modelSign, " namespace should be string")); //必须唯一

  (0, _invariant.default)(!modelList.some(function (m) {
    return namespace === m.namespace;
  }), "".concat(modelSign, " namespace should be unique , the repeated namespace is ").concat(namespace));
}