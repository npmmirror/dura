"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _duraCore = require("dura-core");

var _duraUtil = require("dura-util");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOps = {
  initialModels: [],
  middleware: [],
  enhancers: [],
  plugins: []
};

var enhanceReducer = function enhanceReducer(reducers, onReducers) {
  return Object.keys(reducers).map(function (key) {
    return _defineProperty({}, key, (0, _duraUtil.recursiveEnhanceFun)(onReducers, reducers[key]));
  }).reduce(_duraUtil.objectReduce, {});
};

var enhanceEffect = function enhanceEffect(effects, onEffects) {
  return Object.keys(effects).map(function (key) {
    return _defineProperty({}, key, (0, _duraUtil.recursiveEnhanceFun)(onEffects, effects[key], key));
  }).reduce(_duraUtil.objectReduce, {});
};

var enhanceModels = function enhanceModels(duraCorePro) {
  var plugins = duraCorePro.plugins;
  var onReducers = plugins.filter(function (_ref3) {
    var onReducer = _ref3.onReducer;
    return onReducer;
  }).map(function (_ref4) {
    var onReducer = _ref4.onReducer;
    return onReducer;
  });
  var onEffects = plugins.filter(function (_ref5) {
    var onEffect = _ref5.onEffect;
    return onEffect;
  }).map(function (_ref6) {
    var onEffect = _ref6.onEffect;
    return onEffect;
  });
  return mergeModels(duraCorePro).map(function (_ref7) {
    var namespace = _ref7.namespace,
        _ref7$initialState = _ref7.initialState,
        initialState = _ref7$initialState === void 0 ? {} : _ref7$initialState,
        _ref7$reducers = _ref7.reducers,
        reducers = _ref7$reducers === void 0 ? {} : _ref7$reducers,
        _ref7$effects = _ref7.effects,
        effects = _ref7$effects === void 0 ? {} : _ref7$effects;
    return {
      namespace: namespace,
      initialState: initialState,
      reducers: enhanceReducer(reducers, onReducers),
      effects: enhanceEffect(effects, onEffects)
    };
  });
};

var mergeModels = function mergeModels(duraCorePro) {
  var initialModels = duraCorePro.initialModels,
      plugins = duraCorePro.plugins,
      models = duraCorePro.models;
  return _toConsumableArray(initialModels.concat(models).concat(plugins));
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
    models: enhanceModels(duraCorePro)
  });
  duraCorePro.reduxStore = duraCore.reduxStore;

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