"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var merge = function (prev, next) { return (__assign(__assign({}, prev), next)); };
function default_1(models) {
    return Object.keys(models)
        .map(function (name) { return extractAction(name, models[name]); })
        .reduce(merge, {});
}
exports.default = default_1;
function extractAction(name, model) {
    var _a;
    var reducers = model.reducers, effects = model.effects;
    return _a = {},
        _a[name] = Object.keys(merge(reducers(), effects()))
            .map(function (reducerKey) {
            var _a;
            return (_a = {},
                _a[reducerKey] = function (payload, meta) { return ({
                    type: name + "/" + reducerKey,
                    payload: payload,
                    meta: meta
                }); },
                _a);
        })
            .reduce(merge, {}),
        _a;
}
//# sourceMappingURL=index.js.map