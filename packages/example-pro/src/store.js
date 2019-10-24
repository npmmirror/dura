"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = __importDefault(require("@models/UserModel"));
var plus_1 = require("@dura/plus");
var immer_1 = require("@dura/immer");
var loading_1 = require("@dura/loading");
var actions_1 = __importDefault(require("@dura/actions"));
var HelloModel_1 = __importDefault(require("./container/Home/models/HelloModel"));
var react_redux_1 = require("react-redux");
var lodash_1 = require("lodash");
var initialModel = {
    /**
     * 用户模块
     */
    user: UserModel_1.default,
    /**
     * hello 模块， 主要处理一些乱七八糟的问题
     */
    hello: HelloModel_1.default
};
exports.store = plus_1.create({
    initialModel: initialModel,
    compose: window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
}, {
    immer: immer_1.createImmerPlugin(),
    loading: loading_1.createLoadingPlugin(initialModel)
});
exports.actionCreator = actions_1.default(initialModel);
exports.connectHOC = function (mapState, mapDispatch) {
    return react_redux_1.connect(mapState, mapDispatch, null, {
        areStatesEqual: lodash_1.isEqual,
        areOwnPropsEqual: lodash_1.isEqual,
        areStatePropsEqual: lodash_1.isEqual,
        areMergedPropsEqual: lodash_1.isEqual
    });
};
//# sourceMappingURL=store.js.map