"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCombineEffects = exports.getCombineReducers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _redux = require("redux");

var _reduxActions = require("redux-actions");

var _ActionTypes = _interopRequireDefault(require("./ActionTypes"));

var _DefaultModel = _interopRequireDefault(require("./DefaultModel"));

var reduxSagaEffects = _interopRequireWildcard(require("redux-saga/effects"));

var _this = void 0;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rename = function rename(namespace, argObj, type) {
  return Object.keys(argObj).map(function (key) {
    return _defineProperty({}, "".concat(namespace, "/").concat(type, "/").concat(key), argObj[key]);
  }).reduce(reduce, {});
};

var reduce = function reduce(prev, next) {
  return _objectSpread({}, prev, next);
};

var additionalNamespacePrefix = function additionalNamespacePrefix(model) {
  var namespace = model.namespace,
      _model$reducers = model.reducers,
      reducers = _model$reducers === void 0 ? {} : _model$reducers,
      _model$effects = model.effects,
      effects = _model$effects === void 0 ? {} : _model$effects,
      _model$initialState = model.initialState,
      initialState = _model$initialState === void 0 ? {} : _model$initialState;
  return {
    namespace: namespace,
    initialState: initialState,
    reducers: rename(namespace, reducers, "reducers"),
    effects: rename(namespace, effects, "effects")
  };
};

var mapModelToCombineReducers = function mapModelToCombineReducers(_ref2) {
  var namespace = _ref2.namespace,
      reducers = _ref2.reducers,
      initialState = _ref2.initialState;
  return _defineProperty({}, namespace, (0, _reduxActions.handleActions)(reducers, initialState));
};

var getWatcher = function getWatcher(effect) {
  var name = effect.name,
      saga = effect.saga,
      type = effect.type,
      ms = effect.ms;

  switch (type) {
    case "takeLatest":
      return (
        /*#__PURE__*/
        _regenerator.default.mark(function _callee() {
          var _len,
              args,
              _key,
              _args = arguments;

          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = _args[_key];
                  }

                  _context.next = 3;
                  return reduxSagaEffects.takeLatest.apply(reduxSagaEffects, [name, saga, reduxSagaEffects].concat(args));

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        })
      );

    case "takeLeading":
      return (
        /*#__PURE__*/
        _regenerator.default.mark(function _callee2() {
          var _len2,
              args,
              _key2,
              _args2 = arguments;

          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  for (_len2 = _args2.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = _args2[_key2];
                  }

                  _context2.next = 3;
                  return reduxSagaEffects.takeLeading.apply(reduxSagaEffects, [name, saga, reduxSagaEffects].concat(args));

                case 3:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        })
      );

    case "throttle":
      return (
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3() {
          var _len3,
              args,
              _key3,
              _args3 = arguments;

          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  for (_len3 = _args3.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = _args3[_key3];
                  }

                  _context3.next = 3;
                  return reduxSagaEffects.throttle.apply(reduxSagaEffects, [ms, name, saga, reduxSagaEffects].concat(args));

                case 3:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        })
      );

    default:
      return (
        /*#__PURE__*/
        _regenerator.default.mark(function _callee4() {
          var _len4,
              args,
              _key4,
              _args4 = arguments;

          return _regenerator.default.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  for (_len4 = _args4.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = _args4[_key4];
                  }

                  _context4.next = 3;
                  return reduxSagaEffects.takeEvery.apply(reduxSagaEffects, [name, saga, reduxSagaEffects].concat(args));

                case 3:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        })
      );
  }
};

var enhanceEffect = function enhanceEffect(name, effect) {
  var defaultType = "takeEvery";
  var newEffect = {
    name: name,
    saga: effect,
    type: defaultType,
    ms: 100
  };

  if (Array.isArray(effect)) {
    var _effect = _slicedToArray(effect, 2),
        one = _effect[0],
        two = _effect[1];

    newEffect.saga = one;

    if (typeof two === "string") {
      newEffect.type = two;
    } else if (_typeof(two) === "object") {
      newEffect.type = (two === null || two === void 0 ? void 0 : two.type) || defaultType;

      if ((two === null || two === void 0 ? void 0 : two.type) === "throttle") {
        newEffect.ms = two === null || two === void 0 ? void 0 : two.ms;
      }
    } else {
      newEffect.type = defaultType;
    }
  }

  return newEffect;
};

var mapGenerateSaga =
/*#__PURE__*/
_regenerator.default.mark(function mapGenerateSaga(effects) {
  var effectKs, _i2, name, effect, watcher;

  return _regenerator.default.wrap(function mapGenerateSaga$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          effectKs = Object.keys(effects);
          _i2 = 0;

        case 2:
          if (!(_i2 < effectKs.length)) {
            _context5.next = 11;
            break;
          }

          name = effectKs[_i2];
          effect = enhanceEffect(name, effects[name]);
          watcher = getWatcher(effect);
          _context5.next = 8;
          return reduxSagaEffects.fork(watcher);

        case 8:
          _i2++;
          _context5.next = 2;
          break;

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, mapGenerateSaga, this);
});

var getRootSaga =
/*#__PURE__*/
_regenerator.default.mark(function getRootSaga(effects) {
  var rootTask;
  return _regenerator.default.wrap(function getRootSaga$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return reduxSagaEffects.fork(mapGenerateSaga.bind(this, effects));

        case 2:
          rootTask = _context7.sent;
          _context7.next = 5;
          return reduxSagaEffects.fork(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee5() {
            return _regenerator.default.wrap(function _callee5$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return reduxSagaEffects.take(_ActionTypes.default.CANCEL);

                  case 2:
                    _context6.next = 4;
                    return reduxSagaEffects.cancel(rootTask);

                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee5, this);
          }));

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  }, getRootSaga, this);
});

var enhanceModels = function enhanceModels(models) {
  return [_DefaultModel.default].concat(models).map(function (m) {
    return additionalNamespacePrefix(m);
  });
};

var getCombineReducers = function getCombineReducers() {
  var models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (0, _redux.combineReducers)(enhanceModels(models).map(mapModelToCombineReducers).reduce(reduce, {}));
};

exports.getCombineReducers = getCombineReducers;

var getCombineEffects = function getCombineEffects(models) {
  return getRootSaga.bind(_this, enhanceModels(models).map(function (_ref4) {
    var effects = _ref4.effects;
    return effects;
  }).reduce(reduce, {}));
};

exports.getCombineEffects = getCombineEffects;