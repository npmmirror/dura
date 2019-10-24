"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
var util_1 = require("./util");
function getAsyncMiddleware(rootModel, error) {
    return function (store) { return function (next) { return function (action) {
        var result = next(action);
        var _a = action.type.split('/'), namespace = _a[0], nameeffect = _a[1];
        if (rootModel[namespace]) {
            var moduleEffects = rootModel[namespace].effects(store.dispatch, function () { return cloneDeep_1.default(store.getState()); }, util_1.delay);
            var effect = moduleEffects[nameeffect];
            if (effect) {
                effect(action.payload, action.meta).catch(function (e) {
                    error(e);
                    console.log(e);
                });
            }
        }
        return result;
    }; }; };
}
exports.default = getAsyncMiddleware;
//# sourceMappingURL=async.js.map