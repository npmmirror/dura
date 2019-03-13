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
exports.createLoadingPlugin = function (rootModel) {
    var _this = this;
    var extractEffect = function (model) {
        return Object.keys(model.effects || {})
            .map(function (effectName) {
            var _a;
            return (_a = {}, _a[effectName] = false, _a);
        })
            .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    };
    var state = Object.keys(rootModel)
        .map(function (modelName) {
        var _a;
        return (_a = {},
            _a[modelName] = extractEffect(rootModel[modelName]),
            _a);
    })
        .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
    return {
        name: "loading",
        model: {
            state: state,
            reducers: {
                start: function (payload) {
                    return function (state) {
                        var _a, _b;
                        return __assign({}, state, (_a = {}, _a[payload.modelName] = (_b = {},
                            _b[payload.effectName] = true,
                            _b), _a));
                    };
                },
                end: function (payload) {
                    return function (state) {
                        var _a, _b;
                        return __assign({}, state, (_a = {}, _a[payload.modelName] = (_b = {},
                            _b[payload.effectName] = false,
                            _b), _a));
                    };
                }
            }
        },
        onWrapModel: function (name, model) {
            if (name === "loading") {
                return model;
            }
            var _a = model.effects, effects = _a === void 0 ? {} : _a;
            var start = function (effectName) { return ({ type: "loading/start", payload: { modelName: name, effectName: effectName } }); };
            var end = function (effectName) { return ({ type: "loading/end", payload: { modelName: name, effectName: effectName } }); };
            var nextEffects = Object.keys(effects)
                .map(function (key) {
                var _a;
                return (_a = {},
                    _a[key] = function (payload, meta) { return function (request) { return __awaiter(_this, void 0, void 0, function () {
                        var effectFn, loadingHoc;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    effectFn = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, effects[key](payload, meta)(request)];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    }); }); };
                                    loadingHoc = function (effectFn) { return __awaiter(_this, void 0, void 0, function () {
                                        var error_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    request.dispatch(start(key));
                                                    _a.label = 1;
                                                case 1:
                                                    _a.trys.push([1, 3, , 4]);
                                                    return [4 /*yield*/, effectFn()];
                                                case 2:
                                                    _a.sent();
                                                    request.dispatch(end(key));
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    error_1 = _a.sent();
                                                    request.dispatch(end(key));
                                                    throw error_1;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    if (!(meta || { loading: false }).loading) return [3 /*break*/, 1];
                                    loadingHoc(effectFn);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, effectFn()];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }; },
                    _a);
            })
                .reduce(function (prev, next) { return (__assign({}, prev, next)); }, {});
            return __assign({}, model, { effects: nextEffects });
        }
    };
};
//# sourceMappingURL=index.js.map