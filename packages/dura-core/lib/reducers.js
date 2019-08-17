"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_actions_1 = require("redux-actions");
var lodash_1 = require("lodash");
/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers(name, model) {
    var _a;
    var reducers = model.reducers;
    return _a = {},
        _a[name] = redux_actions_1.handleActions(lodash_1.keys(reducers)
            .map(function (reducerKey) {
            var _a;
            return (_a = {}, _a[name + "/" + reducerKey] = reducers[reducerKey], _a);
        })
            .reduce(lodash_1.merge, {}), model.state),
        _a;
}
exports.default = extractReducers;
//# sourceMappingURL=reducers.js.map