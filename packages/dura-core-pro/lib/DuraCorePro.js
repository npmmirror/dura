"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _duraCore = require("dura-core");

var defaultOps = {
  initialModels: [],
  middleware: [],
  enhancers: [],
  plugins: []
};

function _default() {
  var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOps;
  var duraCorePro = {
    plugins: ops.plugins || [],
    initialModels: ops.initialModels || [],
    models: [],
    addModel: addModel,
    delModel: delModel,
    clear: clear,
    destroy: destroy,
    refresh: refresh
  };
  var duraCore = (0, _duraCore.createDuraCore)({
    models: duraCorePro.initialModels.concat(duraCorePro.models).concat(duraCorePro.plugins)
  });
  console.log(duraCore);
  duraCorePro.getState = duraCore.getState;

  function addModel(model) {
    duraCorePro.models.push(model);
    return duraCorePro;
  }

  function delModel(namespace) {
    duraCorePro.models = duraCorePro.models.filter(function (m) {
      return m.namespace !== namespace;
    });
    return duraCorePro;
  }

  function clear() {
    duraCorePro.models = [];
    return duraCorePro;
  }

  function destroy() {
    duraCorePro.initialModels = [];
    duraCorePro.models = [];
    return duraCorePro;
  }

  function refresh() {
    duraCore.replaceModel(duraCorePro.initialModels.concat(duraCorePro.models).concat(duraCorePro.plugins));
    return duraCorePro;
  }

  return duraCorePro;
}