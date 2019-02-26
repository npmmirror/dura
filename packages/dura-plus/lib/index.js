"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var lodash_1 = __importDefault(require("lodash"));
var actions_1 = require("@dura/actions");
exports.actionCreator = actions_1.actionCreator;
var create = function (config) {
    var _a = config.initialModel, initialModel = _a === void 0 ? {} : _a, _b = config.plugins, plugins = _b === void 0 ? [] : _b, initialState = config.initialState;
    var finalModels = lodash_1.default.merge(initialModel, plugins
        .filter(function (p) { return p.extraModels; })
        .map(function (p) { return p.extraModels; })
        .reduce(lodash_1.default.merge, {}));
    var finalMiddlewares = plugins
        .filter(function (p) { return p.middlewares; })
        .map(function (p) { return p.middlewares; })
        .reduce(lodash_1.default.merge, {});
    return core_1.create({
        initialModel: finalModels,
        initialState: initialState,
        middlewares: finalMiddlewares,
        compose: config.compose,
        createStore: config.createStore
    });
};
exports.create = create;
//# sourceMappingURL=index.js.map