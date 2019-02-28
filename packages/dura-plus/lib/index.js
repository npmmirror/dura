"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var lodash_1 = __importDefault(require("lodash"));
function recursiveOnReducer(modelName, reducer, onReducerList) {
    if (onReducerList && onReducerList.length === 0) {
        return reducer;
    }
    var nextReducer = onReducerList.shift()(modelName, reducer);
    return recursiveOnReducer(modelName, nextReducer, onReducerList);
}
function recursiveOnEffect(modelName, effect, onEffectList) {
    if (onEffectList && onEffectList.length === 0) {
        return effect;
    }
    var nextEffect = onEffectList.shift()(modelName, effect);
    return recursiveOnEffect(modelName, nextEffect, onEffectList);
}
var create = function (config, plugins) {
    var _a = lodash_1.default.cloneDeep(config), initialModel = _a.initialModel, initialState = _a.initialState, middlewares = _a.middlewares;
    var onReducerList = plugins.filter(function (plugin) { return plugin.onReducer; }).map(function (plugin) { return plugin.onReducer; });
    var onEffectList = plugins.filter(function (plugin) { return plugin.onEffect; }).map(function (plugin) { return plugin.onEffect; });
    var initialModelMap = lodash_1.default.keys(initialModel)
        .map(function (name) {
        var _a;
        var model = initialModel[name];
        var reducers = lodash_1.default.entries(model.reducers)
            .map(function (_a) {
            var name = _a[0], reducer = _a[1];
            var _b;
            return (_b = {},
                _b[name] = recursiveOnReducer(name, reducer, onReducerList),
                _b);
        })
            .reduce(lodash_1.default.merge, {});
        var effects = lodash_1.default.entries(model.effects)
            .map(function (_a) {
            var name = _a[0], effect = _a[1];
            var _b;
            return (_b = {},
                _b[name] = recursiveOnEffect(name, effect, onEffectList),
                _b);
        })
            .reduce(lodash_1.default.merge, {});
        return _a = {},
            _a[name] = lodash_1.default.merge(model, { reducers: reducers, effects: effects }),
            _a;
    })
        .reduce(lodash_1.default.merge, {});
    return core_1.create({
        initialModel: initialModelMap,
        initialState: initialState,
        middlewares: middlewares,
        compose: config.compose,
        createStore: config.createStore
    });
};
exports.create = create;
//# sourceMappingURL=index.js.map