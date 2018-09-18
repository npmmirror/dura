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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
  }).reduce(function (prev, next) {
    return _objectSpread({}, prev, next);
  }, {});
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
  var onReducers = duraCorePro.plugins.filter(function (_ref2) {
    var onReducer = _ref2.onReducer;
    return onReducer;
  }).map(function (_ref3) {
    var onReducer = _ref3.onReducer;
    return onReducer;
  });
  var duraCore = (0, _duraCore.createDuraCore)({
    models: _toConsumableArray(duraCorePro.initialModels.concat(duraCorePro.models).concat(duraCorePro.plugins)).map(function (_ref4) {
      var namespace = _ref4.namespace,
          initialState = _ref4.initialState,
          _ref4$reducers = _ref4.reducers,
          reducers = _ref4$reducers === void 0 ? {} : _ref4$reducers,
          effects = _ref4.effects;
      return {
        namespace: namespace,
        initialState: initialState,
        effects: effects,
        reducers: enhanceReducer(reducers, onReducers)
      };
    })
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