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
exports.createImmerPlugin = function () {
    return {
        wrapModel: function (name, model) {
            var convert = function (_a) {
                var _b;
                var k = _a[0], v = _a[1];
                return (_b = {},
                    _b[k] = function (state, payload, meta) {
                        return immer_1.default(state, function (draftState) { return v(draftState, payload, meta); });
                    },
                    _b);
            };
            var reducers = function () {
                var _a, _b, _c, _d;
                return Object.entries((_d = (_c = (_a = model) === null || _a === void 0 ? void 0 : (_b = _a).reducers) === null || _c === void 0 ? void 0 : _c.call(_b), (_d !== null && _d !== void 0 ? _d : {})))
                    .map(convert)
                    .reduce(function (prev, next) { return (__assign(__assign({}, prev), next)); }, {});
            };
            return __assign(__assign({}, model), { reducers: reducers });
        }
    };
};
//# sourceMappingURL=index.js.map