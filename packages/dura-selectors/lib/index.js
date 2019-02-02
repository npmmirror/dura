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
var extractSelectors = function (name, model) {
    var _a = model.selectors, selectors = _a === void 0 ? {} : _a;
    return Object.keys(selectors)
        .map(function (name) {
        var _a;
        return (_a = {}, _a[name] = selectors[name](), _a);
    })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
};
var createSelectorRunner = function (rootModel) {
    var rootModelKeys = Object.keys(rootModel);
    var selectors = rootModelKeys
        .map(function (name) {
        var _a;
        return (_a = {},
            _a[name] = extractSelectors(name, rootModel[name]),
            _a);
    })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    return selectors;
};
exports.createSelectorsPlugin = function () {
    return {
        name: "selectors",
        onStoreCreated: function (store, rootModel) {
            store.selectorRunner = createSelectorRunner(rootModel);
        }
    };
};
//# sourceMappingURL=index.js.map