"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDuraCore = createDuraCore;

var _redux = require("redux");

var _reduxSaga2 = _interopRequireDefault(require("redux-saga"));

var _PluginHandler = _interopRequireDefault(require("./PluginHandler"));

var _ModelHandler = _interopRequireDefault(require("./ModelHandler"));

var _invariant = _interopRequireDefault(require("invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDuraCore() {
  var pluginHandler = new _PluginHandler.default();
  var modelHandler = new _ModelHandler.default({
    pluginHandler: pluginHandler
  });
  var duraCore = {
    _reduxStore: undefined,
    _reduxSaga: undefined,
    _namespaces: {},
    addModel: addModel,
    delModel: delModel,
    addPlugin: addPlugin,
    start: start,
    restart: restart
  };
  return duraCore;

  function validate(target) {
    var namespace = target.namespace; //必须有namespace

    (0, _invariant.default)(namespace, "namespace should be defined"); //必须是string类型

    (0, _invariant.default)(typeof namespace === 'string', "namespace should be string"); //必须唯一

    (0, _invariant.default)(!duraCore._namespaces[namespace], "namespace should be unique , the repeated namespace is ".concat(namespace));
  }

  function addPlugin() {
    for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins[_key] = arguments[_key];
    }

    plugins.forEach(function (plugin) {
      validate(plugin);
      duraCore._namespaces[plugin.namespace] = plugin;
      pluginHandler.addPlugin(plugin);
    });
  }

  function addModel() {
    for (var _len2 = arguments.length, models = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      models[_key2] = arguments[_key2];
    }

    models.forEach(function (model) {
      validate(model);
      duraCore._namespaces[model.namespace] = model;
      modelHandler.addModel(model);
    });
  }

  function delModel() {
    for (var _len3 = arguments.length, namespaces = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      namespaces[_key3] = arguments[_key3];
    }

    namespaces.forEach(function (namespace) {
      delete duraCore._namespaces[namespace];
      modelHandler.delModel(namespace);
    });
  }

  function start() {
    duraCore._reduxSaga = (0, _reduxSaga2.default)();
    duraCore._reduxStore = (0, _redux.createStore)(modelHandler.getCombineReducers(), (0, _redux.applyMiddleware)(duraCore._reduxSaga));
    var onStateChangeEventFuns = pluginHandler.getOnStateChangeEventFun();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var fun = _step.value;

        duraCore._reduxStore.subscribe(function () {
          fun(duraCore._reduxStore.getState());
        });
      };

      for (var _iterator = onStateChangeEventFuns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    duraCore._reduxSaga.run(modelHandler.getCombineEffects());
  }

  function restart() {
    var _reduxStore = duraCore._reduxStore,
        _reduxSaga = duraCore._reduxSaga;

    _reduxStore.replaceReducer(modelHandler.getCombineReducers());

    _reduxStore.dispatch({
      type: '@@duraCore/reducers/onChangeState'
    });

    _reduxStore.dispatch({
      type: '@@dura/cancel'
    });

    _reduxSaga.run(modelHandler.getCombineEffects());
  }
}