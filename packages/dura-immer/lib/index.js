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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = __importDefault(require("immer"));
exports.default = {
    name: "immer",
    onWrapModel: function (name, model) {
        var reducers = model.reducers;
        var nextReducers = Object.keys(reducers)
            .map(function (name) {
            var _a;
            return (_a = {},
                _a[name] = function (payload, meta) { return function (baseState) {
                    return immer_1.default(baseState, function (draftState) { return reducers[name](payload, meta)(draftState); });
                }; },
                _a);
        })
            .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
        return __assign({}, model, { reducers: nextReducers });
    }
};
//# sourceMappingURL=index.js.map