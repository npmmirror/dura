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
exports.default = {
    name: "loading",
    model: {
        state: {},
        reducers: {
            onChangeLoading: function (payload) {
                return function (state) {
                    var _a, _b;
                    return __assign({}, state, (_a = {}, _a[payload.name] = (_b = {},
                        _b[payload.fnName] = payload.loading,
                        _b), _a));
                };
            }
        }
    },
    wrapModel: function (model) { return model; },
    intercept: {
        pre: function (action) { return action && action.meta && action.meta.loading; },
        before: function (action, dispatch) {
            var _a = action.type.split("/"), name = _a[0], fnName = _a[1];
            dispatch({
                type: "loading/onChangeLoading",
                payload: {
                    name: name,
                    fnName: fnName,
                    loading: true
                }
            });
        },
        after: function (action, dispatch) {
            var _a = action.type.split("/"), name = _a[0], fnName = _a[1];
            dispatch({
                type: "loading/onChangeLoading",
                payload: {
                    name: name,
                    fnName: fnName,
                    loading: false
                }
            });
        }
    }
};
//# sourceMappingURL=index.js.map