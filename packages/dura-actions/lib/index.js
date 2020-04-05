"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@dura/utils");
function createActions(models) {
    return Object.entries(models)
        .map(function (_a) {
        var k = _a[0], m = _a[1];
        return extractAction(k, m);
    })
        .reduce(utils_1.merge, utils_1.noop());
}
exports.createActions = createActions;
function extractAction(name, model) {
    var _a;
    var reducers = model.reducers, effects = model.effects;
    return _a = {},
        _a[name] = Object.keys(utils_1.merge(reducers(), effects()))
            .map(function (reducerKey) {
            var _a;
            return (_a = {},
                _a[reducerKey] = function (payload, meta) { return ({
                    type: name + "/" + reducerKey,
                    payload: payload,
                    meta: meta,
                }); },
                _a);
        })
            .reduce(utils_1.merge, {}),
        _a;
}
//# sourceMappingURL=index.js.map