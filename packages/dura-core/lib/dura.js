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
var redux_1 = require("redux");
var reducersPlugin_1 = __importDefault(require("./reducersPlugin"));
var redux_actions_1 = require("redux-actions");
var Dura = /** @class */ (function () {
    function Dura(config) {
        /**
         * 全局models
         */
        this.gModels = [];
        /**
         * 全局的插件
         */
        this.gPlugins = [];
        this.config = config;
        config.models.forEach(this.addModel.bind(this));
        this.gPlugins = [reducersPlugin_1.default()].concat(config.plugins);
    }
    Dura.prototype.extractReducer = function (model) {
        var _a;
        var nextReducer = Object.keys(model.reducers)
            .map(function (key) {
            var _a;
            return (_a = {}, _a[model.name + "." + key] = model.reducers[key], _a);
        })
            .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
        return _a = {}, _a[model.name] = redux_actions_1.handleActions(nextReducer, model.state), _a;
    };
    Dura.prototype.mergeReducers = function () {
        return redux_1.combineReducers(this.gModels.map(this.extractReducer.bind(this)).reduce(function (prev, next) { return (__assign({}, prev, next)); }, {}));
    };
    Dura.prototype.addModel = function (model) {
        var exits = this.gModels.some(function (m) { return m.name === model.name; });
        if (exits) {
            throw new Error("[model.name] repeat definition!");
        }
        var onModelFns = this.gPlugins.filter(function (plugin) { return plugin.onModel; }).map(function (plugin) { return plugin.onModel; });
        var recursive = function (fns, model) { return (fns.length === 0 ? model : recursive(fns, fns.shift()(model))); };
        var nextModel = recursive(onModelFns, model);
        this.gModels.push(nextModel);
    };
    /**
     * 创建store
     */
    Dura.prototype.createDuraStore = function () {
        var _this = this;
        var storeEnhancer = redux_1.compose(redux_1.applyMiddleware.apply(void 0, this.config.middlewares));
        var reduxStore = redux_1.createStore(this.mergeReducers(), this.config.initialState || {}, storeEnhancer);
        this.duraStore = __assign({}, reduxStore, { models: function () {
                var models = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    models[_i] = arguments[_i];
                }
                models.forEach(_this.addModel.bind(_this));
                _this.duraStore.replaceReducer(_this.mergeReducers());
            } });
        return this.duraStore;
    };
    return Dura;
}());
exports.default = Dura;
//# sourceMappingURL=dura.js.map