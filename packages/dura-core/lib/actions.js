"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var redux_actions_1 = require("redux-actions");
function extractActions(models) {
    return lodash_1.default.keys(models)
        .map(function (name) { return extractAction(name, models[name]); })
        .reduce(lodash_1.default.merge, {});
}
exports.default = extractActions;
function extractAction(name, model) {
    var _a;
    var _b = lodash_1.default.cloneDeep(model), reducers = _b.reducers, effects = _b.effects;
    return _a = {},
        _a[name] = lodash_1.default.keys(lodash_1.default.merge(reducers, effects))
            .map(function (reducerKey) {
            var _a;
            return (_a = {},
                _a[reducerKey] = redux_actions_1.createAction(name + "/" + reducerKey, function (payload) { return payload; }, function (payload, meta) { return meta; }),
                _a);
        })
            .reduce(lodash_1.default.merge, {}),
        _a;
}
//# sourceMappingURL=actions.js.map