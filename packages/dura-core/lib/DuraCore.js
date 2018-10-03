"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _redux = require("redux");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _ModelHandler = require("./ModelHandler");

var _ActionTypes = _interopRequireDefault(require("./ActionTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var defaultOps = {
  models: [],
  middleware: [],
  enhancers: [],
  initialState: {}
};

function _default() {
  var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOps;
  var _ops$models = ops.models,
      models = _ops$models === void 0 ? [] : _ops$models,
      _ops$middleware = ops.middleware,
      middleware = _ops$middleware === void 0 ? [] : _ops$middleware,
      _ops$enhancers = ops.enhancers,
      enhancers = _ops$enhancers === void 0 ? [] : _ops$enhancers,
      _ops$initialState = ops.initialState,
      initialState = _ops$initialState === void 0 ? {} : _ops$initialState;
  var duraCore = {
    dispatch: undefined,
    getState: undefined,
    subscribe: undefined,
    reduxStore: undefined,
    replaceModel: replaceModel
  }; //redux-dev-tools enhancers

  var composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || _redux.compose; //create redux-saga middleware

  var reduxSaga = (0, _reduxSaga.default)(); //create redux store

  var reduxStore = (0, _redux.createStore)((0, _ModelHandler.getCombineReducers)(models), initialState, composeEnhancers.apply(void 0, [_redux.applyMiddleware.apply(void 0, [reduxSaga].concat(_toConsumableArray(middleware)))].concat(_toConsumableArray(enhancers)))); //run redux-saga

  reduxSaga.run((0, _ModelHandler.getCombineEffects)(models));
  duraCore.reduxStore = reduxStore;

  function replaceModel() {
    var nextModels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var _done = arguments.length > 1 ? arguments[1] : undefined;

    return new Promise(function (resolve) {
      reduxStore.dispatch({
        type: _ActionTypes.default.CANCEL,
        done: function () {
          var _done2 = _asyncToGenerator(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee() {
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    reduxStore.replaceReducer((0, _ModelHandler.getCombineReducers)(nextModels));
                    reduxSaga.run((0, _ModelHandler.getCombineEffects)(nextModels));
                    reduxStore.dispatch({
                      type: _ActionTypes.default.PLUS_COUNT
                    });
                    _context.next = 5;
                    return _done === null || _done === void 0 ? void 0 : _done();

                  case 5:
                    resolve(duraCore);

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function done() {
            return _done2.apply(this, arguments);
          };
        }()
      });
    });
  }

  return duraCore;
}