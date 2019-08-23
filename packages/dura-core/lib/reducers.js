"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_actions_1 = require("redux-actions");
var keys_1 = __importDefault(require("lodash/keys"));
var merge_1 = __importDefault(require("lodash/merge"));
/**
 * 提取reducers
 * @param name
 * @param model
 */
function extractReducers(name, model) {
    var _a;
    var reducers = model.reducers;
    return _a = {},
        _a[name] = redux_actions_1.handleActions(keys_1.default(reducers)
            .map(function (reducerKey) {
            var _a;
            return (_a = {}, _a[name + "/" + reducerKey] = reducers[reducerKey], _a);
        })
            .reduce(merge_1.default, {}), model.state),
        _a;
}
exports.default = extractReducers;
//# sourceMappingURL=reducers.js.map