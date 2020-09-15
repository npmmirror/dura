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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@dura/core", "invariant", "@dura/async", "@dura/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.configura = void 0;
    var core_1 = require("@dura/core");
    var invariant_1 = __importDefault(require("invariant"));
    var async_1 = require("@dura/async");
    var utils_1 = require("@dura/utils");
    var defaultConfiguraOptions = {
        enhancers: [],
        middlewares: [],
    };
    function configura(options) {
        if (options === void 0) { options = defaultConfiguraOptions; }
        return function (models, preloadedState) {
            var enhancers = options.enhancers, middlewares = options.middlewares;
            var effects = {};
            var getEffects = function (namespace, methodName) {
                return effects[namespace][methodName];
            };
            var addEffects = function (nextModels) {
                var index = -1;
                while (++index < nextModels.length) {
                    var model = nextModels[index];
                    invariant_1.default(!(model.namespace in effects), "the model already exists, please note that the namespace needs to be unique!");
                    effects[model.namespace] = model.effects;
                }
            };
            addEffects(models);
            var asyncMiddleware = async_1.createAsyncMiddleware(getEffects);
            var factoryOfStore = core_1.createStoreFactory(models, {
                middlewares: __spreadArrays([asyncMiddleware], middlewares),
                enhancers: enhancers,
                preloadedState: preloadedState,
            });
            var use = function () {
                var thunkModels = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    thunkModels[_i] = arguments[_i];
                }
                addEffects(thunkModels);
                factoryOfStore.use(thunkModels);
            };
            var unUse = function () {
                var thunkModels = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    thunkModels[_i] = arguments[_i];
                }
                var index = -1;
                while (++index < thunkModels.length) {
                    var model = thunkModels[index];
                    delete effects[model.namespace];
                }
                factoryOfStore.unUse(thunkModels);
            };
            var factory = __assign(__assign({}, factoryOfStore), { use: use,
                unUse: unUse });
            utils_1.defineHiddenConstantProperty(factory, utils_1.DURA_STORE_REDUCERS, factoryOfStore["reducers"]);
            utils_1.defineHiddenConstantProperty(factory, utils_1.DURA_STORE_EFFECTS, effects);
            return factory;
        };
    }
    exports.configura = configura;
});
//# sourceMappingURL=index.js.map