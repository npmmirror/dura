"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var lodash_1 = __importDefault(require("lodash"));
var create = function (config, plugin) {
    var _a = lodash_1.default.cloneDeep(config), _b = _a.initialModel, initialModel = _b === void 0 ? {} : _b, initialState = _a.initialState, middlewares = _a.middlewares;
    return core_1.create({
        initialModel: initialModel,
        initialState: initialState,
        middlewares: middlewares,
        compose: config.compose,
        createStore: config.createStore
    });
};
exports.create = create;
//# sourceMappingURL=index.js.map