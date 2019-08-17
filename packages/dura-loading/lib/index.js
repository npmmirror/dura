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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.createLoadingPlugin = function (modelMap) {
    var _this = this;
    var initialState = lodash_1.entries(modelMap)
        .map(function (_a) {
        var _b;
        var modelName = _a[0], model = _a[1];
        return (_b = {},
            _b[modelName] = lodash_1.keys(model.effects)
                .map(function (effectName) {
                var _a;
                return (_a = {}, _a[effectName] = false, _a);
            })
                .reduce(lodash_1.merge, {}),
            _b);
    })
        .reduce(lodash_1.merge, {});
    return {
        onEffect: function (modelName, effectName, effect) {
            return function (effectApi, action) { return __awaiter(_this, void 0, void 0, function () {
                var start, end, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            start = function () {
                                return effectApi.dispatch({
                                    type: "loading/startLoading",
                                    payload: {
                                        modelName: modelName,
                                        effectName: effectName
                                    }
                                });
                            }, end = function () {
                                return effectApi.dispatch({
                                    type: "loading/endLoading",
                                    payload: {
                                        modelName: modelName,
                                        effectName: effectName
                                    }
                                });
                            };
                            if (!(action.meta && action.meta.loading)) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            start();
                            return [4 /*yield*/, effect(effectApi, action)];
                        case 2:
                            _a.sent();
                            end();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            end();
                            throw error_1;
                        case 4: return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, effect(effectApi, action)];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            }); };
        },
        extraModel: {
            loading: {
                state: initialState,
                reducers: {
                    startLoading: function (state, action) {
                        var _a, _b;
                        return __assign({}, state, (_a = {}, _a[action.payload.modelName] = (_b = {},
                            _b[action.payload.effectName] = true,
                            _b), _a));
                    },
                    endLoading: function (state, action) {
                        var _a, _b;
                        return __assign({}, state, (_a = {}, _a[action.payload.modelName] = (_b = {},
                            _b[action.payload.effectName] = false,
                            _b), _a));
                    }
                },
                effects: {}
            }
        }
    };
};
//# sourceMappingURL=index.js.map