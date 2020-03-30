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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var redux_1 = require("redux");
exports.compose = redux_1.compose;
exports.bindActionCreators = redux_1.bindActionCreators;
exports.applyMiddleware = redux_1.applyMiddleware;
exports.combineReducers = redux_1.combineReducers;
function recursiveWrapModel(name, model, wrapModelList) {
    if (wrapModelList && wrapModelList.length === 0) {
        return model;
    }
    var nextModel = wrapModelList.shift()(name, model);
    return recursiveWrapModel(name, nextModel, wrapModelList);
}
function getExtraModelMap(pluginMap) {
    if (pluginMap === void 0) { pluginMap = {}; }
    return Object.values(pluginMap)
        .filter(function (plugin) { return plugin.extraModel; })
        .map(function (plugin) { return plugin.extraModel; })
        .reduce(function (prev, next) { return (__assign(__assign({}, prev), next)); }, {});
}
function create(config, pluginMap) {
    //clone
    var initialModel = config.initialModel, initialState = config.initialState, middlewares = config.middlewares, _a = config.extraReducers, extraReducers = _a === void 0 ? {} : _a, _b = config.error, error = _b === void 0 ? function () { return false; } : _b;
    var wrapModelList = Object.values((pluginMap !== null && pluginMap !== void 0 ? pluginMap : {}))
        .filter(function (p) { return p.wrapModel; })
        .map(function (p) { return p.wrapModel; });
    var extraModelMap = getExtraModelMap(pluginMap);
    var initialModelMap = Object.entries(__assign(__assign({}, initialModel), extraModelMap))
        .map(function (_a) {
        var _b;
        var name = _a[0], model = _a[1];
        var newModel = recursiveWrapModel(name, model, __spreadArrays(wrapModelList));
        return _b = {},
            _b[name] = newModel,
            _b;
    })
        .reduce(function (prev, next) { return (__assign(__assign({}, prev), next)); }, {});
    return core_1.create({
        initialModel: initialModelMap,
        initialState: initialState,
        middlewares: middlewares,
        compose: config.compose,
        createStore: config.createStore,
        extraReducers: extraReducers,
        error: error
    });
}
exports.create = create;
//# sourceMappingURL=index.js.map