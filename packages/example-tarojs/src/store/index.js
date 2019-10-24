"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CountModel_1 = __importDefault(require("../models/CountModel"));
var plus_1 = require("@dura/plus");
var immer_1 = require("@dura/immer");
var loading_1 = require("@dura/loading");
var actions_1 = __importDefault(require("@dura/actions"));
var initialModel = {
    count: CountModel_1.default
};
exports.store = plus_1.create({
    initialModel: initialModel
}, {
    immer: immer_1.createImmerPlugin(),
    loading: loading_1.createLoadingPlugin(initialModel)
});
var actionCreator = actions_1.default(initialModel);
exports.actionCreator = actionCreator;
//# sourceMappingURL=index.js.map