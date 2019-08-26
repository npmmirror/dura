"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var merge_1 = __importDefault(require("lodash/merge"));
/**
 * 创建store
 * @param config
 */
function create(options) {
    var models = cloneDeep_1.default(options).models;
    var reducers = models
        .map(function (model) {
        var _a;
        var nameForModel = model.name();
        return _a = {},
            _a[nameForModel] = function (state, action) {
                if (state === void 0) { state = model.state(); }
                var type = action.type, _a = action.payload, payload = _a === void 0 ? {} : _a, _b = action.meta, meta = _b === void 0 ? {} : _b;
                var _c = type.split('/'), namespace = _c[0], reducerName = _c[1];
                if (nameForModel !== namespace) {
                    return state;
                }
                var reducer = model.reducers()[reducerName];
                if (reducer) {
                    return reducer(state, payload, meta);
                }
                return state;
            },
            _a;
    })
        .reduce(merge_1.default, {});
    console.log(reducers);
    var reduxStore = redux_1.createStore(redux_1.combineReducers(reducers));
    return reduxStore;
    // //聚合reducers
    // const modelReducers = Object.keys(initialModel)
    //   .map((name: string) => extractReducers(name, initialModel[name]))
    //   .reduce((prev, next) => ({ ...prev, ...next }), {});
    // const rootReducers: ReducersMapObject<any> = { ...modelReducers, ...extraReducers };
    // //获取外部传入的 compose
    // const composeEnhancers = config.compose || compose;
    // //store增强器
    // const storeEnhancer = composeEnhancers(applyMiddleware(...middlewares, getAsyncMiddleware(initialModel)));
    // //获取外部传入的 createStore
    // const _createStore = config.createStore || createStore;
    // //创建redux-store
    // const reduxStore = initialState
    //   ? _createStore(combineReducers(rootReducers), initialState, storeEnhancer)
    //   : _createStore(combineReducers(rootReducers), storeEnhancer);
    // return { ...reduxStore, actionCreator: extractActions(initialModel) };
}
exports.create = create;
//# sourceMappingURL=store.js.map