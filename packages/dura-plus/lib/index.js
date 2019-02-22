"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var async_1 = require("@dura/async");
var async_loading_1 = require("@dura/async-loading");
exports.create = function (initialRootModel, config) {
    var otherPlugins = config.plugins || [];
    return core_1.create({
        initialModel: initialRootModel,
        plugins: [async_1.createAsyncPlugin(), async_loading_1.createLoadingPlugin(initialRootModel)].concat(otherPlugins),
        initialState: config.initialState || {},
        middlewares: config.middlewares || [],
        compose: config.compose,
        createStore: config.createStore
    });
};
//# sourceMappingURL=index.js.map