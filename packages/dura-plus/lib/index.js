"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var values_1 = __importDefault(require("lodash/values"));
var merge_1 = __importDefault(require("lodash/merge"));
var entries_1 = __importDefault(require("lodash/entries"));
function recursiveWrapModel(name, model, wrapModelList) {
    if (wrapModelList && wrapModelList.length === 0) {
        return model;
    }
    var nextModel = wrapModelList.shift()(name, model);
    return recursiveWrapModel(name, nextModel, wrapModelList);
}
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
function getOnReducers(pluginMap) {
    return values_1.default(pluginMap)
        .filter(function (plugin) { return plugin.onReducer; })
        .map(function (plugin) { return plugin.onReducer; });
}
function getOnEffect(pluginMap) {
    return values_1.default(pluginMap).filter(function (plugin) { return plugin.onEffect; });
}
function getExtraModelMap(pluginMap) {
    return values_1.default(pluginMap)
        .filter(function (plugin) { return plugin.extraModel; })
        .map(function (plugin) { return plugin.extraModel; })
        .reduce(merge_1.default, {});
}
function create(config, pluginMap) {
    //clone
    var _a = cloneDeep_1.default(config), initialModel = _a.initialModel, initialState = _a.initialState, middlewares = _a.middlewares, _b = _a.extraReducers, extraReducers = _b === void 0 ? {} : _b;
    var wrapModelList = values_1.default(pluginMap)
        .filter(function (p) { return p.wrapModel; })
        .map(function (p) { return p.wrapModel; });
    var extraModelMap = getExtraModelMap(pluginMap);
    var initialModelMap = entries_1.default(merge_1.default(initialModel, extraModelMap))
        .map(function (_a) {
        var _b;
        var name = _a[0], model = _a[1];
        var newModel = recursiveWrapModel(name, model, wrapModelList);
        return _b = {},
            _b[name] = newModel,
            _b;
    })
        .reduce(merge_1.default, {});
    // const initialModelMap = entries(merge(initialModel, extraModelMap))
    //   .map(([modelName, model]) => {
    //     const reducers = model.reducers ? model.reducers : () => ({});
    //     const effects = model.effects ? model.effects : () => ({});
    //     const nextReducers = entries(reducers())
    //       .map(([reducerName, reducer]) => ({
    //         [reducerName]: recursiveOnReducer(
    //           modelName,
    //           reducerName,
    //           reducer,
    //           cloneDeep(onReducerList)
    //         )
    //       }))
    //       .reduce(merge, {});
    //     const nextEffects = entries(effects())
    //       .map(([effectName, effects]) => ({
    //         [effectName]: recursiveOnEffect(
    //           modelName,
    //           effectName,
    //           effects,
    //           cloneDeep(onEffectList)
    //         )
    //       }))
    //       .reduce(merge, {});
    //     return {
    //       [modelName]: {
    //         ...model,
    //         reducers: () => nextReducers,
    //         effects: (dispatch, getState, delpoy) => nextEffects
    //       }12
    //     };
    //   })
    //   .reduce(merge, {});
    return core_1.create({
        initialModel: initialModelMap,
        initialState: initialState,
        middlewares: middlewares,
        compose: config.compose,
        createStore: config.createStore,
        extraReducers: extraReducers
    });
}
exports.create = create;
//# sourceMappingURL=index.js.map