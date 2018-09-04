"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _redux = require("redux");

var _reduxActions = require("redux-actions");

var _duraUtil = require("dura-util");

var reduxSagaEffects = _interopRequireWildcard(require("redux-saga/effects"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ModelHandler =
/*#__PURE__*/
function () {
  function ModelHandler(_ref) {
    var pluginHandler = _ref.pluginHandler;

    _classCallCheck(this, ModelHandler);

    _defineProperty(this, "models", []);

    _defineProperty(this, "pluginHandler", undefined);

    _defineProperty(this, "defaultModels", [{
      namespace: '@@duraCore',
      initialState: {
        count: 0
      },
      reducers: {
        onChangeState: function onChangeState(state) {
          return _objectSpread({}, state, {
            count: state.count + 1
          });
        }
      }
    }]);

    this.pluginHandler = pluginHandler;
  }

  _createClass(ModelHandler, [{
    key: "addModel",
    value: function addModel(model) {
      this.models.push(this._additionalNamespacePrefix(model));
    }
  }, {
    key: "delModel",
    value: function delModel(namespace) {
      this.models = this.models.filter(function (model) {
        return model.namespace !== namespace;
      });
    }
  }, {
    key: "getCombineReducers",
    value: function getCombineReducers() {
      var _this = this;

      var len = this._getModels().length;

      return (0, _redux.combineReducers)(this._getModels().slice(0, len).map(function (_ref2) {
        var namespace = _ref2.namespace,
            _ref2$reducers = _ref2.reducers,
            reducers = _ref2$reducers === void 0 ? {} : _ref2$reducers,
            _ref2$initialState = _ref2.initialState,
            initialState = _ref2$initialState === void 0 ? {} : _ref2$initialState;
        return _defineProperty({}, namespace, (0, _reduxActions.handleActions)(_this._applyOnReducerEvent(Object.keys(reducers), reducers, {}), initialState));
      }).reduce(this._reduce, {}));
    }
  }, {
    key: "getCombineEffects",
    value: function getCombineEffects() {
      var effects = this._getModels().map(function (_ref4) {
        var effects = _ref4.effects;
        return effects;
      }).reduce(function (prev, next) {
        return _objectSpread({}, prev, next);
      }, {});

      return this._getRootSaga.bind(this, effects);
    }
  }, {
    key: "_getModels",
    value: function _getModels() {
      var _this2 = this;

      var defaultModels = this.defaultModels.map(function (model) {
        return _this2._additionalNamespacePrefix(model);
      });
      var pluginModels = this.pluginHandler.plugins.filter(function (plugin) {
        return plugin.reducers;
      }).map(function (plugin) {
        return {
          namespace: plugin.namespace,
          initialState: plugin.initialState || {},
          reducers: plugin.reducers
        };
      }).map(function (pluginModel) {
        return _this2._additionalNamespacePrefix(pluginModel);
      });
      return defaultModels.concat(this.models).concat(pluginModels);
    }
  }, {
    key: "_mapGenerateSaga",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function _mapGenerateSaga(effects) {
      var effectKs, _i, name, effect, watcher;

      return _regenerator.default.wrap(function _mapGenerateSaga$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              effectKs = Object.keys(effects);
              _i = 0;

            case 2:
              if (!(_i < effectKs.length)) {
                _context.next = 11;
                break;
              }

              name = effectKs[_i];
              effect = this._packEffect(name, effects[name]);
              watcher = this._getWatcher(effect);
              _context.next = 8;
              return reduxSagaEffects.fork(watcher);

            case 8:
              _i++;
              _context.next = 2;
              break;

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _mapGenerateSaga, this);
    })
  }, {
    key: "_getRootSaga",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function _getRootSaga(effects) {
      var rootTask;
      return _regenerator.default.wrap(function _getRootSaga$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return reduxSagaEffects.fork(this._mapGenerateSaga.bind(this, effects));

            case 2:
              rootTask = _context3.sent;
              _context3.next = 5;
              return reduxSagaEffects.fork(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee() {
                return _regenerator.default.wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return reduxSagaEffects.take("@@dura/cancel");

                      case 2:
                        _context2.next = 4;
                        return reduxSagaEffects.cancel(rootTask);

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee, this);
              }));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _getRootSaga, this);
    })
  }, {
    key: "_packEffect",
    value: function _packEffect(name, effect) {
      var defaultType = 'takeEvery';
      var newEffect = {
        name: name,
        saga: undefined,
        type: defaultType,
        ms: 100
      };
      var onEffectEventFuns = this.pluginHandler.getOnEffectEventFun();

      if (!Array.isArray(effect)) {
        newEffect.saga = (0, _duraUtil.recursiveEnhanceFun)(onEffectEventFuns, effect, name, reduxSagaEffects);
      } else {
        var _effect = _slicedToArray(effect, 2),
            saga = _effect[0],
            conf = _effect[1];

        if (!_typeof(conf)) {
          newEffect.type = defaultType;
        } else if (typeof conf === 'string') {
          newEffect.type = conf;
        } else if (_typeof(conf) === 'object') {
          newEffect.type = (conf === null || conf === void 0 ? void 0 : conf.type) || defaultType;
        } else {
          newEffect.type = defaultType;
        }

        newEffect.saga = (0, _duraUtil.recursiveEnhanceFun)(onEffectEventFuns, saga, name, reduxSagaEffects);
      }

      return newEffect;
    }
  }, {
    key: "_getWatcher",
    value: function _getWatcher(effect) {
      var name = effect.name,
          saga = effect.saga,
          type = effect.type,
          ms = effect.ms;

      switch (type) {
        case 'takeLatest':
          return (
            /*#__PURE__*/
            _regenerator.default.mark(function _callee2() {
              var _len,
                  args,
                  _key,
                  _args4 = arguments;

              return _regenerator.default.wrap(function _callee2$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      for (_len = _args4.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = _args4[_key];
                      }

                      _context4.next = 3;
                      return reduxSagaEffects.takeLatest(name, saga, reduxSagaEffects, args);

                    case 3:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee2, this);
            })
          );

        case 'takeLeading':
          return (
            /*#__PURE__*/
            _regenerator.default.mark(function _callee3() {
              var _len2,
                  args,
                  _key2,
                  _args5 = arguments;

              return _regenerator.default.wrap(function _callee3$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      for (_len2 = _args5.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = _args5[_key2];
                      }

                      _context5.next = 3;
                      return reduxSagaEffects.takeLeading(name, saga, reduxSagaEffects, args);

                    case 3:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee3, this);
            })
          );

        case 'throttle':
          return (
            /*#__PURE__*/
            _regenerator.default.mark(function _callee4() {
              var _len3,
                  args,
                  _key3,
                  _args6 = arguments;

              return _regenerator.default.wrap(function _callee4$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      for (_len3 = _args6.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = _args6[_key3];
                      }

                      _context6.next = 3;
                      return reduxSagaEffects.throttle(ms, name, saga, reduxSagaEffects, args);

                    case 3:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee4, this);
            })
          );

        default:
          return (
            /*#__PURE__*/
            _regenerator.default.mark(function _callee5() {
              var _len4,
                  args,
                  _key4,
                  _args7 = arguments;

              return _regenerator.default.wrap(function _callee5$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      for (_len4 = _args7.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = _args7[_key4];
                      }

                      _context7.next = 3;
                      return reduxSagaEffects.takeEvery(name, saga, reduxSagaEffects, args);

                    case 3:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee5, this);
            })
          );
      }
    }
  }, {
    key: "_applyOnReducerEvent",
    value: function _applyOnReducerEvent(reducerKeys, reducers, nextReducers) {
      var first = reducerKeys.shift();

      if (first) {
        return this._applyOnReducerEvent(reducerKeys, reducers, _objectSpread({}, nextReducers, _defineProperty({}, first, (0, _duraUtil.recursiveEnhanceFun)(this.pluginHandler.getOnReducerEventFun(), reducers[first]))));
      }

      return nextReducers;
    }
  }, {
    key: "_additionalNamespacePrefix",
    value: function _additionalNamespacePrefix(model) {
      var namespace = model.namespace,
          _model$reducers = model.reducers,
          reducers = _model$reducers === void 0 ? {} : _model$reducers,
          _model$effects = model.effects,
          effects = _model$effects === void 0 ? {} : _model$effects,
          _model$initialState = model.initialState,
          initialState = _model$initialState === void 0 ? {} : _model$initialState;
      var _ref5 = [this._rename(namespace, reducers, 'reducers'), this._rename(namespace, effects, 'effects')],
          newReducers = _ref5[0],
          newEffects = _ref5[1];
      return {
        namespace: namespace,
        initialState: initialState,
        reducers: newReducers,
        effects: newEffects
      };
    }
  }, {
    key: "_reduce",
    value: function _reduce(prev, next) {
      return _objectSpread({}, prev, next);
    }
  }, {
    key: "_rename",
    value: function _rename(namespace, argObj, type) {
      return Object.keys(argObj).map(function (key) {
        return _defineProperty({}, "".concat(namespace, "/").concat(type, "/").concat(key), argObj[key]);
      }).reduce(this._reduce, {});
    }
  }]);

  return ModelHandler;
}();

var _default = ModelHandler;
exports.default = _default;