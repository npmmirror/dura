"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _redux = require("redux");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _ModelHandler = require("./ModelHandler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var defaultOps = {
  models: [],
  middleware: [],
  enhancers: []
};

function _default() {
  var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOps;
  var _ops$models = ops.models,
      models = _ops$models === void 0 ? [] : _ops$models,
      _ops$middleware = ops.middleware,
      middleware = _ops$middleware === void 0 ? [] : _ops$middleware,
      _ops$enhancers = ops.enhancers,
      enhancers = _ops$enhancers === void 0 ? [] : _ops$enhancers;
  var duraCore = {
    dispatch: undefined,
    getState: undefined,
    subscribe: undefined,
    replaceModel: replaceModel
  }; //redux-dev-tools enhancers

  var composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || _redux.compose; //create redux-saga middleware

  var reduxSaga = (0, _reduxSaga.default)(); //create redux store

  var reduxStore = (0, _redux.createStore)((0, _ModelHandler.getCombineReducers)(models), composeEnhancers.apply(void 0, [_redux.applyMiddleware.apply(void 0, [reduxSaga].concat(_toConsumableArray(middleware)))].concat(_toConsumableArray(enhancers)))); //run redux-saga

  reduxSaga.run((0, _ModelHandler.getCombineEffects)(models));
  duraCore.dispatch = reduxStore.dispatch;
  duraCore.getState = reduxStore.getState;
  duraCore.subscribe = reduxStore.subscribe;
  duraCore.reduxStore = reduxStore;

  function replaceModel(nextModels) {
    reduxStore.dispatch({
      type: "@@dura/cancel"
    });
    reduxStore.replaceReducer((0, _ModelHandler.getCombineReducers)(nextModels));
    reduxSaga.run((0, _ModelHandler.getCombineEffects)(nextModels));
    reduxStore.dispatch({
      type: "@@duraCore/reducers/onChangeCount"
    });
  }

  return duraCore;
}