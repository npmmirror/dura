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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_actions_1 = require("redux-actions");
var clone_1 = __importDefault(require("clone"));
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
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name, model) {
    var effects = model.effects || {};
    var effectKeys = Object.keys(effects);
    var nextEffects = effectKeys
        .map(function (effectName) {
        var _a;
        return (_a = {}, _a[name + "/" + effectName] = effects[effectName], _a);
    })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    return nextEffects;
}
function createEffectsMiddleware(allModel) {
    var _this = this;
    //聚合effects
    var rootEffects = Object.keys(allModel)
        .map(function (name) { return extractEffects(name, allModel[name]); })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, ms); }); };
    return function (store) { return function (next) { return function (action) { return __awaiter(_this, void 0, void 0, function () {
        var result, dispatch, getState, effect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = next(action);
                    if (!(typeof rootEffects[action.type] === "function")) return [3 /*break*/, 2];
                    dispatch = store.dispatch;
                    getState = function () { return clone_1.default(store.getState()); };
                    effect = rootEffects[action.type](action.payload, action.meta);
                    return [4 /*yield*/, effect({
                            dispatch: dispatch,
                            getState: getState,
                            delay: delay
                        })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, result];
            }
        });
    }); }; }; };
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
    var nextModel = firstPlugin.wrapModel(name, model);
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
    var _a = config.initialModel, initialModel = _a === void 0 ? {} : _a, _b = config.plugins, plugins = _b === void 0 ? [] : _b;
    var pluginModel = getPluginModel(plugins);
    return __assign({}, initialModel, pluginModel);
}
//包装根model
function wrapRootModel(rootModel, plugin) {
    var wrapModelPlugins = plugin.filter(function (p) { return p.wrapModel; });
    //包装已有的model
    return Object.keys(rootModel)
        .map(function (name) { return wrapModel(wrapModelPlugins, name, rootModel[name]); })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
}
/**
 * 创建store
 * @param config
 */
function create(config) {
    var initialState = config.initialState, _a = config.plugins, plugins = _a === void 0 ? [] : _a;
    //merge plugin 的model
    var rootModel = mergeModel(config);
    //包装model
    var nextRootModel = wrapRootModel(rootModel, plugins);
    //聚合reducers
    var rootReducers = Object.keys(nextRootModel)
        .map(function (name) { return extractReducers(name, nextRootModel[name]); })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    var middlewares = plugins.filter(function (p) { return p.createMiddleware; }).map(function (p) { return p.createMiddleware(nextRootModel); });
    //创建effects的中间件
    // const effectMiddleware = createEffectsMiddleware(nextRootModel);
    //store增强器
    var storeEnhancer = redux_1.compose(redux_1.applyMiddleware.apply(void 0, middlewares));
    //创建redux-store
    var reduxStore = (initialState
        ? redux_1.createStore(redux_1.combineReducers(rootReducers), initialState, storeEnhancer)
        : redux_1.createStore(redux_1.combineReducers(rootReducers), storeEnhancer));
    var actionRunner = createActionRunner(nextRootModel, reduxStore.dispatch);
    return __assign({}, reduxStore, { actionRunner: actionRunner });
}
exports.create = create;
function createModelActionRunner(name, model, dispatch) {
    var _a;
    var _b = model.reducers, reducers = _b === void 0 ? {} : _b, _c = model.effects, effects = _c === void 0 ? {} : _c;
    var reducerKeys = Object.keys(reducers);
    var effectKeys = Object.keys(effects);
    var merge = function (prev, next) { return (__assign({}, prev, next)); };
    var createActionMap = function (key) {
        var _a;
        return (_a = {},
            _a[key] = function (payload, meta) {
                return dispatch(redux_actions_1.createAction(name + "/" + key, function (payload) { return payload; }, function (payload, meta) { return meta; })(payload, meta));
            },
            _a);
    };
    var action = reducerKeys.concat(effectKeys).map(createActionMap).reduce(merge, {});
    return _a = {}, _a[name] = action, _a;
}
function createActionRunner(models, dispatch) {
    var merge = function (prev, next) { return (__assign({}, prev, next)); };
    return Object.keys(models)
        .map(function (name) { return createModelActionRunner(name, models[name], dispatch); })
        .reduce(merge, {});
}
//# sourceMappingURL=index.js.map