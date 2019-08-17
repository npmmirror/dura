"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var redux_actions_1 = require("redux-actions");
function extractActions(models) {
    return lodash_1.keys(models)
        .map(function (name) { return extractAction(name, models[name]); })
        .reduce(lodash_1.merge, {});
}
exports.default = extractActions;
function extractAction(name, model) {
    var _a;
    var _b = lodash_1.cloneDeep(model), reducers = _b.reducers, effects = _b.effects;
    return _a = {},
        _a[name] = lodash_1.keys(lodash_1.merge(reducers, effects))
            .map(function (reducerKey) {
            var _a;
            return (_a = {},
                _a[reducerKey] = redux_actions_1.createAction(name + "/" + reducerKey, function (payload) { return payload; }, function (payload, meta) { return meta; }),
                _a);
        })
            .reduce(lodash_1.merge, {}),
        _a;
}
//# sourceMappingURL=actions.js.map