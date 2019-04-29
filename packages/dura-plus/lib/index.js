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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var lodash_1 = __importDefault(require("lodash"));
function recursiveOnReducer(modelName, reducerName, reducer, onReducerList) {
    if (onReducerList && onReducerList.length === 0) {
        return reducer;
    }
    var nextReducer = onReducerList.shift()(modelName, reducerName, reducer);
    return recursiveOnReducer(modelName, reducerName, nextReducer, onReducerList);
}
function recursiveOnEffect(modelName, effectName, effect, onEffectList) {
    if (onEffectList && onEffectList.length === 0) {
        return effect;
    }
    var nextEffect = onEffectList.shift()(modelName, effectName, effect);
    return recursiveOnEffect(modelName, effectName, nextEffect, onEffectList);
}
var create = function (config, pluginMap) {
    //clone
    var _a = lodash_1.default.cloneDeep(config), initialModel = _a.initialModel, initialState = _a.initialState, middlewares = _a.middlewares, extraReducers = _a.extraReducers;
    var onReducerList = lodash_1.default.values(pluginMap)
        .filter(function (plugin) { return plugin.onReducer; })
        .map(function (plugin) { return plugin.onReducer; });
    var onEffectList = lodash_1.default.values(pluginMap)
        .filter(function (plugin) { return plugin.onEffect; })
        .map(function (plugin) { return plugin.onEffect; });
    var extraModelMap = lodash_1.default.values(pluginMap)
        .filter(function (plugin) { return plugin.extraModel; })
        .map(function (plugin) { return plugin.extraModel; })
        .reduce(lodash_1.default.merge, {});
    var initialModelMap = lodash_1.default.entries(lodash_1.default.merge(initialModel, extraModelMap))
        .map(function (_a) {
        var modelName = _a[0], model = _a[1];
        var _b;
        var reducers = lodash_1.default.entries(model.reducers)
            .map(function (_a) {
            var reducerName = _a[0], reducer = _a[1];
            var _b;
            return (_b = {},
                _b[reducerName] = recursiveOnReducer(modelName, reducerName, reducer, lodash_1.default.cloneDeep(onReducerList)),
                _b);
        })
            .reduce(lodash_1.default.merge, {});
        var effects = lodash_1.default.entries(model.effects)
            .map(function (_a) {
            var effectName = _a[0], effects = _a[1];
            var _b;
            return (_b = {},
                _b[effectName] = recursiveOnEffect(modelName, effectName, effects, lodash_1.default.cloneDeep(onEffectList)),
                _b);
        })
            .reduce(lodash_1.default.merge, {});
        return _b = {},
            _b[modelName] = __assign({}, model, { reducers: reducers,
                effects: effects }),
            _b;
    })
        .reduce(lodash_1.default.merge, {});
    return core_1.create({
        initialModel: initialModelMap,
        initialState: initialState,
        middlewares: middlewares,
        compose: config.compose,
        createStore: config.createStore,
        extraReducers: config.extraReducers
    });
};
exports.create = create;
//# sourceMappingURL=index.js.map