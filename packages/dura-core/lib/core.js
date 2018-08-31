"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDuraCore = createDuraCore;

var _redux = require("redux");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _validation = require("./validation");

var _reduxActions = require("redux-actions");

var reduxSagaEffects = _interopRequireWildcard(require("redux-saga/effects"));

require("dura-util");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOptions = {
  initialModel: []
};

var _reduce = function _reduce(prev, next) {
  return _objectSpread({}, prev, next);
};

function createDuraCore() {
  var _marked2 =
  /*#__PURE__*/
  regeneratorRuntime.mark(_handlerModelTask),
      _marked3 =
  /*#__PURE__*/
  regeneratorRuntime.mark(_handlerGlobalTask);

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

  var newOps = _objectSpread({}, defaultOptions, options);

  var duraCore = {
    _models: [],
    _plugins: [],
    _initialModel: newOps.initialModel,
    _reduxStore: undefined,
    _reduxSaga: undefined,
    addModel: addModel,
    delModel: delModel,
    addPlugin: addPlugin,
    start: start,
    restart: restart
  };
  return duraCore;

  function addPlugin() {
    var _duraCore$_plugins;

    (_duraCore$_plugins = duraCore._plugins).push.apply(_duraCore$_plugins, arguments);
  }

  function addModel() {
    var _models = duraCore._models;

    for (var _len = arguments.length, models = new Array(_len), _key = 0; _key < _len; _key++) {
      models[_key] = arguments[_key];
    }

    models.forEach(function (_model) {
      return (0, _validation.validateModel)(_model, _models);
    });
    models.forEach(function (_model) {
      return _models.push(_additionalNamespacePrefix(_model));
    });
  }

  function delModel() {
    for (var _len2 = arguments.length, namespace = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      namespace[_key2] = arguments[_key2];
    }

    console.log("delModel:", namespace);
  }

  function start() {
    duraCore._reduxSaga = (0, _reduxSaga.default)();
    duraCore._reduxStore = (0, _redux.createStore)((0, _redux.combineReducers)(_handlerReducers()), (0, _redux.applyMiddleware)(duraCore._reduxSaga));
    console.log("start");

    duraCore._reduxSaga.run(_handlerEffects());
  }

  function restart() {
    console.log("restart");
  }

  function _handlerReducers() {
    return duraCore._models.map(function (_ref) {
      var namespace = _ref.namespace,
          _ref$reducers = _ref.reducers,
          reducers = _ref$reducers === void 0 ? {} : _ref$reducers,
          _ref$initialState = _ref.initialState,
          initialState = _ref$initialState === void 0 ? {} : _ref$initialState;
      return _defineProperty({}, namespace, (0, _reduxActions.handleActions)(enhanceReducers(reducers, Object.keys(reducers), {}), initialState));
    }).reduce(_reduce, {});
  }

  function enhanceReducers(reducers, reducerKeys, nextReducers) {
    var first = reducerKeys.shift();

    if (first) {
      return enhanceReducers(reducers, reducerKeys, _objectSpread({}, nextReducers, _defineProperty({}, first, enhance(reducers[first]))));
    }

    return nextReducers;
  }

  function recursiveFun(funArray, targetFun) {
    var first = funArray.shift();

    if (first) {
      return recursiveFun(funArray, first(targetFun));
    }

    return targetFun;
  }

  function enhance(reducer) {
    return _redux.compose.apply(void 0, _toConsumableArray(_getPluginOnReducers()).concat([reducer]))(); // return recursiveFun(_getPluginOnReducers() , reducer)
    // const pluginReducers = _getPluginOnReducers();
    // let newReducer = reducer
    // for (const fn of pluginReducers) {
    //     newReducer = fn(reducer)
    // }
    // return newReducer;
  }

  function _getPluginOnReducers() {
    return duraCore._plugins.map(function (plugin) {
      return (plugin === null || plugin === void 0 ? void 0 : plugin.onReducer) || function (reducer) {
        return reducer;
      };
    });
  }

  function _getPluginOnEffects() {
    return duraCore._plugins.map(function (plugin) {
      return (plugin === null || plugin === void 0 ? void 0 : plugin.onEffect) || function (effect) {
        return effect;
      };
    });
  }

  function _additionalNamespacePrefix(model) {
    var namespace = model.namespace,
        _model$reducers = model.reducers,
        reducers = _model$reducers === void 0 ? {} : _model$reducers,
        _model$effects = model.effects,
        effects = _model$effects === void 0 ? {} : _model$effects,
        _model$initialState = model.initialState,
        initialState = _model$initialState === void 0 ? {} : _model$initialState;

    var _createNewReducerName = function _createNewReducerName(key) {
      return _defineProperty({}, [namespace, key].join("/"), reducers[key]);
    };

    var _createNewEffectName = function _createNewEffectName(key) {
      return _defineProperty({}, [namespace, key].join("/"), effects[key]);
    };

    var newReducers = Object.keys(reducers).map(_createNewReducerName).reduce(_reduce, {});
    var newEffects = Object.keys(effects).map(_createNewEffectName).reduce(_reduce, {});
    return {
      namespace: namespace,
      initialState: initialState,
      reducers: newReducers,
      effects: newEffects
    };
  }

  function _handlerModelTask(effects, model) {
    var effectKeys, _loop, j;

    return regeneratorRuntime.wrap(function _handlerModelTask$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            effectKeys = Object.keys(effects);
            _loop =
            /*#__PURE__*/
            regeneratorRuntime.mark(function _loop(j) {
              var _marked, key, val, saga, conf, type, pluginOnEffects, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn, watcher, effectTask;

              return regeneratorRuntime.wrap(function _loop$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      watcher = function _ref5() {
                        return regeneratorRuntime.wrap(function watcher$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                _context5.t0 = type;
                                _context5.next = _context5.t0 === 'takeLatest' ? 3 : _context5.t0 === 'takeLeading' ? 4 : _context5.t0 === 'throttle' ? 5 : 6;
                                break;

                              case 3:
                                return _context5.abrupt("return",
                                /*#__PURE__*/
                                regeneratorRuntime.mark(function _callee() {
                                  var _len3,
                                      args,
                                      _key3,
                                      _args = arguments;

                                  return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                      switch (_context.prev = _context.next) {
                                        case 0:
                                          for (_len3 = _args.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                                            args[_key3] = _args[_key3];
                                          }

                                          _context.next = 3;
                                          return reduxSagaEffects.takeLatest(key, saga, reduxSagaEffects, args);

                                        case 3:
                                        case "end":
                                          return _context.stop();
                                      }
                                    }
                                  }, _callee, this);
                                }));

                              case 4:
                                return _context5.abrupt("return",
                                /*#__PURE__*/
                                regeneratorRuntime.mark(function _callee2() {
                                  var _len4,
                                      args,
                                      _key4,
                                      _args2 = arguments;

                                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                      switch (_context2.prev = _context2.next) {
                                        case 0:
                                          for (_len4 = _args2.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                                            args[_key4] = _args2[_key4];
                                          }

                                          _context2.next = 3;
                                          return reduxSagaEffects.takeLeading(key, saga, reduxSagaEffects, args);

                                        case 3:
                                        case "end":
                                          return _context2.stop();
                                      }
                                    }
                                  }, _callee2, this);
                                }));

                              case 5:
                                return _context5.abrupt("return",
                                /*#__PURE__*/
                                regeneratorRuntime.mark(function _callee3() {
                                  var _conf;

                                  var _len5,
                                      args,
                                      _key5,
                                      _args3 = arguments;

                                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                      switch (_context3.prev = _context3.next) {
                                        case 0:
                                          for (_len5 = _args3.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                                            args[_key5] = _args3[_key5];
                                          }

                                          _context3.next = 3;
                                          return reduxSagaEffects.throttle(((_conf = conf) === null || _conf === void 0 ? void 0 : _conf.ms) || 100, key, saga, reduxSagaEffects, args);

                                        case 3:
                                        case "end":
                                          return _context3.stop();
                                      }
                                    }
                                  }, _callee3, this);
                                }));

                              case 6:
                                return _context5.abrupt("return",
                                /*#__PURE__*/
                                regeneratorRuntime.mark(function _callee4() {
                                  var _len6,
                                      args,
                                      _key6,
                                      _args4 = arguments;

                                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                      switch (_context4.prev = _context4.next) {
                                        case 0:
                                          for (_len6 = _args4.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                                            args[_key6] = _args4[_key6];
                                          }

                                          _context4.next = 3;
                                          return reduxSagaEffects.takeEvery(key, saga, reduxSagaEffects, args);

                                        case 3:
                                        case "end":
                                          return _context4.stop();
                                      }
                                    }
                                  }, _callee4, this);
                                }));

                              case 7:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        }, _marked, this);
                      };

                      _marked =
                      /*#__PURE__*/
                      regeneratorRuntime.mark(watcher);
                      key = effectKeys[j];
                      val = effects[key];
                      saga = val, conf = void 0, type = 'takeEvery';

                      if (Array.isArray(val)) {
                        saga = val[0];
                        conf = val[1];

                        if (typeof val[1] === 'string') {
                          type = conf;
                        } else if (_typeof(val[1]) === 'object') {
                          type = conf.type || 'takeEvery';
                        } else {
                          type = 'takeEvery';
                        }
                      }

                      pluginOnEffects = _getPluginOnEffects();
                      _iteratorNormalCompletion = true;
                      _didIteratorError = false;
                      _iteratorError = undefined;
                      _context7.prev = 10;

                      for (_iterator = pluginOnEffects[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        fn = _step.value;
                        saga = fn(saga, model);
                      }

                      _context7.next = 18;
                      break;

                    case 14:
                      _context7.prev = 14;
                      _context7.t0 = _context7["catch"](10);
                      _didIteratorError = true;
                      _iteratorError = _context7.t0;

                    case 18:
                      _context7.prev = 18;
                      _context7.prev = 19;

                      if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                      }

                    case 21:
                      _context7.prev = 21;

                      if (!_didIteratorError) {
                        _context7.next = 24;
                        break;
                      }

                      throw _iteratorError;

                    case 24:
                      return _context7.finish(21);

                    case 25:
                      return _context7.finish(18);

                    case 26:
                      _context7.t1 = reduxSagaEffects;
                      _context7.next = 29;
                      return watcher();

                    case 29:
                      _context7.t2 = _context7.sent;
                      _context7.next = 32;
                      return _context7.t1.fork.call(_context7.t1, _context7.t2);

                    case 32:
                      effectTask = _context7.sent;
                      _context7.next = 35;
                      return reduxSagaEffects.fork(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee5() {
                        return regeneratorRuntime.wrap(function _callee5$(_context6) {
                          while (1) {
                            switch (_context6.prev = _context6.next) {
                              case 0:
                                _context6.next = 2;
                                return reduxSagaEffects.take(["@@".concat(key), "cancel"].join('/'));

                              case 2:
                                _context6.next = 4;
                                return cancel(effectTask);

                              case 4:
                              case "end":
                                return _context6.stop();
                            }
                          }
                        }, _callee5, this);
                      }));

                    case 35:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _loop, this, [[10, 14, 18, 26], [19,, 21, 25]]);
            });
            j = 0;

          case 3:
            if (!(j < effectKeys.length)) {
              _context8.next = 8;
              break;
            }

            return _context8.delegateYield(_loop(j), "t0", 5);

          case 5:
            j++;
            _context8.next = 3;
            break;

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    }, _marked2, this);
  }

  function _handlerGlobalTask() {
    var _this = this;

    var _models, _loop2, i;

    return regeneratorRuntime.wrap(function _handlerGlobalTask$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _models = duraCore._models;
            _loop2 =
            /*#__PURE__*/
            regeneratorRuntime.mark(function _loop2(i) {
              var model, namespace, effects, modelTask;
              return regeneratorRuntime.wrap(function _loop2$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      model = _models[i];
                      namespace = model.namespace, effects = model.effects;
                      _context10.next = 4;
                      return reduxSagaEffects.fork(_handlerModelTask.bind(_this, effects, model));

                    case 4:
                      modelTask = _context10.sent;
                      _context10.next = 7;
                      return reduxSagaEffects.fork(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee6() {
                        return regeneratorRuntime.wrap(function _callee6$(_context9) {
                          while (1) {
                            switch (_context9.prev = _context9.next) {
                              case 0:
                                _context9.next = 2;
                                return reduxSagaEffects.take(["@@".concat(namespace), "cancel"].join('/'));

                              case 2:
                                _context9.next = 4;
                                return cancel(modelTask);

                              case 4:
                              case "end":
                                return _context9.stop();
                            }
                          }
                        }, _callee6, this);
                      }));

                    case 7:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _loop2, this);
            });
            i = 0;

          case 3:
            if (!(i < _models.length)) {
              _context11.next = 8;
              break;
            }

            return _context11.delegateYield(_loop2(i), "t0", 5);

          case 5:
            i++;
            _context11.next = 3;
            break;

          case 8:
          case "end":
            return _context11.stop();
        }
      }
    }, _marked3, this);
  }

  function _handlerEffects() {
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var globalTask;
        return regeneratorRuntime.wrap(function _callee8$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return reduxSagaEffects.fork(_handlerGlobalTask);

              case 2:
                globalTask = _context13.sent;
                _context13.next = 5;
                return reduxSagaEffects.fork(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee7() {
                  return regeneratorRuntime.wrap(function _callee7$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          _context12.next = 2;
                          return reduxSagaEffects.take(["@@dura", "cancel"].join("/"));

                        case 2:
                          _context12.next = 4;
                          return cancel(globalTask);

                        case 4:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee7, this);
                }));

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee8, this);
      })
    );
  }
}