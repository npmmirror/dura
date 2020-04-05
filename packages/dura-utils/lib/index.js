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
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, ms); });
}
exports.delay = delay;
function merge(prev, next) {
    return __assign(__assign({}, prev), next);
}
exports.merge = merge;
function noop() {
    return {};
}
exports.noop = noop;
