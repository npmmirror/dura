"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immer_1 = __importDefault(require("immer"));
exports.createImmerPlugin = function () {
    return {
        onReducer: function (modelName, reducerName, reducer) {
            return function (baseState, action) { return immer_1.default(baseState, function (draftState) { return reducer(draftState, action); }); };
        }
    };
};
//# sourceMappingURL=index.js.map