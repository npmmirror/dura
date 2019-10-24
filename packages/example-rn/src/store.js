"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UserModel_1 = __importDefault(require("./models/UserModel"));
var RouterModel_1 = __importDefault(require("./models/RouterModel"));
var plus_1 = require("@dura/plus");
var immer_1 = require("@dura/immer");
var loading_1 = require("@dura/loading");
var actions_1 = __importDefault(require("@dura/actions"));
var lodash_1 = require("lodash");
var react_redux_1 = require("react-redux");
var initialModel = {
    /**
     * 用户模块1
     */
    user: UserModel_1.default,
    router: RouterModel_1.default
};
var error = [];
exports.store = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? plus_1.create({
        initialModel: initialModel,
        compose: window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
        middlewares: [
            function (store) { return function (next) { return function (action) {
                error.push(action);
                next(action);
            }; }; }
        ],
        error: function (e) {
            console.log(JSON.stringify(error));
        }
    }, {
        immer: immer_1.createImmerPlugin(),
        loading: loading_1.createLoadingPlugin(initialModel)
    })
    : plus_1.create({
        initialModel: initialModel,
        middlewares: [
            function (store) { return function (next) { return function (action) {
                error.push(action);
                next(action);
            }; }; }
        ],
        error: function (e) {
            console.log(JSON.stringify(error));
        }
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