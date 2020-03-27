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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var async_1 = __importDefault(require("./async"));
var util_1 = require("./util");
/**
 * 创建store
 * @param config
 */
function create(config) {
    var initialModel = config.initialModel, initialState = config.initialState, _a = config.middlewares, middlewares = _a === void 0 ? [] : _a, _b = config.extraReducers, extraReducers = _b === void 0 ? {} : _b, _c = config.error, error = _c === void 0 ? function () { return false; } : _c;
    var convert = function (_a) {
        var _b;
        var k = _a[0], v = _a[1];
        return (_b = {},
            _b[k] = function (state, _a) {
                if (state === void 0) { state = v.state(); }
                var payload = _a.payload, meta = _a.meta, type = _a.type;
                var _b, _c, _d, _e, _f, _g, _h, _j;
                var nameForReducer = (_b = type.split("/")) === null || _b === void 0 ? void 0 : _b[1];
                try {
                    return (_j = (_h = (_f = (_e = (_c = v) === null || _c === void 0 ? void 0 : (_d = _c).reducers) === null || _e === void 0 ? void 0 : _e.call(_d)) === null || _f === void 0 ? void 0 : (_g = _f)[nameForReducer]) === null || _h === void 0 ? void 0 : _h.call(_g, state, payload, meta), (_j !== null && _j !== void 0 ? _j : state));
                }
                catch (e) {
                    error(e);
                    return state;
                }
            },
            _b);
    };
    //聚合reducers
    var modelReducers = Object.entries(initialModel)
        .map(convert)
        .reduce(util_1.merge, util_1.noop());
    var rootReducers = __assign(__assign({}, modelReducers), extraReducers);
    // //获取外部传入的 compose1
    var composeEnhancers = config.compose || redux_1.compose;
    //store增强器
    var storeEnhancer = composeEnhancers(redux_1.applyMiddleware.apply(void 0, __spreadArrays(middlewares, [async_1.default(initialModel, error)])));
    // //获取外部传入的 createStore
    var _createStore = config.createStore || redux_1.createStore;
    // //创建redux-store
    var reduxStore = initialState
        ? _createStore(redux_1.combineReducers(rootReducers), initialState, storeEnhancer)
        : _createStore(redux_1.combineReducers(rootReducers), storeEnhancer);
    return reduxStore;
}
exports.create = create;
//# sourceMappingURL=store.js.map