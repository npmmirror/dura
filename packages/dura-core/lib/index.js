"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_actions_1 = require("redux-actions");
/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers(name, model) {
    var _a;
    var reducers = model.reducers || {};
    var reducerKeys = Object.keys(reducers);
    var nextReducer = reducerKeys
        .map(function (reducerName) {
        var _a;
        return (_a = {},
            _a[name + "/" + reducerName] = function (state, action) { return reducers[reducerName](action.payload, action.meta)(state); },
            _a);
    })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    return _a = {}, _a[name] = redux_actions_1.handleActions(nextReducer, model.state), _a;
}
/**
 * 包装原始model
 * @param plugins
 * @param name
 * @param model
 */
function wrapModel(plugins, name, model) {
    var _a;
    if (plugins && plugins.length === 0) {
        return _a = {}, _a[name] = model, _a;
    }
    var firstPlugin = plugins.shift();
    var nextModel = firstPlugin.onWrapModel(name, model);
    return wrapModel(plugins, name, nextModel);
}
/**
 * 获取插件里面的model
 * @param plugins
 */
function getPluginModel(plugins) {
    return plugins
        .filter(function (p) { return p.model; })
        .map(function (_a) {
        var name = _a.name, model = _a.model;
        var _b;
        return (_b = {},
            _b[name] = model,
            _b);
    })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
}
//合并所有的model
function mergeModel(config) {
    var initialModel = config.initialModel, _a = config.plugins, plugins = _a === void 0 ? [] : _a;
    var pluginModel = getPluginModel(plugins);
    return __assign({}, initialModel, pluginModel);
}
//包装根model
function wrapRootModel(rootModel, plugin) {
    var wrapModelPlugins = plugin.filter(function (p) { return p.onWrapModel; });
    //包装已有的model
    return Object.keys(rootModel)
        .map(function (name) { return wrapModel(wrapModelPlugins.slice(), name, rootModel[name]); })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
}
/**
 * 创建store
 * @param config
 */
function create(config) {
    var initialState = config.initialState, _a = config.plugins, plugins = _a === void 0 ? [] : _a, _b = config.middlewares, middlewares = _b === void 0 ? [] : _b;
    //merge plugin 的model
    var rootModel = mergeModel(config);
    //包装model
    var nextRootModel = wrapRootModel(rootModel, plugins);
    //聚合reducers
    var rootReducers = Object.keys(nextRootModel)
        .map(function (name) { return extractReducers(name, nextRootModel[name]); })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    var pluginMiddlewares = plugins.filter(function (p) { return p.onCreateMiddleware; }).map(function (p) { return p.onCreateMiddleware(nextRootModel); });
    var composeEnhancers = config.compose || redux_1.compose;
    //store增强器
    var storeEnhancer = composeEnhancers(redux_1.applyMiddleware.apply(void 0, pluginMiddlewares.concat(middlewares)));
    var _createStore = config.createStore || redux_1.createStore;
    //创建redux-store
    var reduxStore = (initialState
        ? _createStore(redux_1.combineReducers(rootReducers), initialState, storeEnhancer)
        : _createStore(redux_1.combineReducers(rootReducers), storeEnhancer));
    var reducerRunner = createReducerRunner(nextRootModel, reduxStore.dispatch);
    plugins.filter(function (p) { return p.onStoreCreated; }).forEach(function (p) { return p.onStoreCreated(reduxStore, nextRootModel); });
    return __assign({}, reduxStore, { reducerRunner: reducerRunner });
}
exports.create = create;
//创建单个model 的reducer runner
function createModelReducerRunner(name, model, dispatch) {
    var _a;
    var _b = model.reducers, reducers = _b === void 0 ? {} : _b;
    var reducerKeys = Object.keys(reducers);
    var merge = function (prev, next) { return (__assign({}, prev, next)); };
    var createActionMap = function (key) {
        var _a;
        return (_a = {},
            _a[key] = function (payload, meta) {
                return dispatch(redux_actions_1.createAction(name + "/" + key, function (payload) { return payload; }, function (payload, meta) { return meta; })(payload, meta));
            },
            _a);
    };
    var action = reducerKeys.slice().map(createActionMap).reduce(merge, {});
    return _a = {}, _a[name] = action, _a;
}
//创建全局的reducer  runner
function createReducerRunner(models, dispatch) {
    var merge = function (prev, next) { return (__assign({}, prev, next)); };
    return Object.keys(models)
        .map(function (name) { return createModelReducerRunner(name, models[name], dispatch); })
        .reduce(merge, {});
}
//# sourceMappingURL=index.js.map