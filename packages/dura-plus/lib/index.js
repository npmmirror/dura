"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@dura/core");
var async_1 = require("@dura/async");
var async_loading_1 = require("@dura/async-loading");
var immer_1 = require("@dura/immer");
var selectors_1 = require("@dura/selectors");
exports.createDura = function (initialRootModel, config) {
    return core_1.create({
        initialModel: initialRootModel,
        plugins: [
            async_1.createAsyncPlugin(),
            async_loading_1.createLoadingPlugin(initialRootModel),
            immer_1.createImmerPlugin(),
            selectors_1.createSelectorsPlugin()
        ].concat((config.plugins || [])),
        initialState: config.initialState || {},
        middlewares: config.middlewares || []
    });
};
//# sourceMappingURL=index.js.map