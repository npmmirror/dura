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
var lodash_1 = __importDefault(require("lodash"));
var async_1 = __importDefault(require("./async"));
var actions_1 = __importDefault(require("./actions"));
var reducers_1 = __importDefault(require("./reducers"));
/**
 * 创建store
 * @param config
 */
function create(config) {
    var _a = lodash_1.default.cloneDeep(config), initialModel = _a.initialModel, initialState = _a.initialState, _b = _a.middlewares, middlewares = _b === void 0 ? [] : _b, _c = _a.extraReducers, extraReducers = _c === void 0 ? {} : _c;
    //聚合reducers
    var modelReducers = Object.keys(initialModel)
        .map(function (name) { return reducers_1.default(name, initialModel[name]); })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    var rootReducers = __assign({}, modelReducers, extraReducers);
    //获取外部传入的 compose
    var composeEnhancers = config.compose || redux_1.compose;
    //store增强器
    var storeEnhancer = composeEnhancers(redux_1.applyMiddleware.apply(void 0, middlewares.concat([async_1.default(initialModel)])));
    //获取外部传入的 createStore
    var _createStore = config.createStore || redux_1.createStore;
    //创建redux-store
    var reduxStore = initialState
        ? _createStore(redux_1.combineReducers(rootReducers), initialState, storeEnhancer)
        : _createStore(redux_1.combineReducers(rootReducers), storeEnhancer);
    return __assign({}, reduxStore, { actionCreator: actions_1.default(initialModel) });
}
exports.create = create;
//# sourceMappingURL=store.js.map