"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
var actions_1 = __importDefault(require("@dura/actions"));
describe('测试plus', function () {
    it('测试插件额外的model', function () {
        var UserModel = {
            state: function () { return ({
                name: undefined
            }); },
            reducers: function () { return ({
                onChangeLoad: function (state, action) {
                    return state;
                }
            }); },
            effects: function (dispatch, getState, delay) { return ({
                onAsyncChangeName: function (effectApi, action) {
                    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); });
                }
            }); }
        };
        var plugins = {
            loading: {
                extraModel: {
                    loading: {
                        state: function () { return ({
                            name: '测试loading'
                        }); },
                        reducers: function () { return ({
                            loadingChange: function (state, action) {
                                return state;
                            }
                        }); },
                        effects: function () { return ({}); }
                    }
                }
            },
            immer: {
                extraModel: {
                    immer: {
                        state: function () { return ({
                            name: '测试immer'
                        }); },
                        reducers: function () { return ({
                            immerChange: function (state, action) {
                                return state;
                            }
                        }); },
                        effects: function () { return ({}); }
                    }
                }
            }
        };
        var store = index_1.create({
            initialModel: {
                user: UserModel
            }
        }, plugins);
        expect(store.getState().loading.name).toEqual('测试loading');
    });
    it('测试插件', function () {
        var _this = this;
        var UserModel = {
            state: function () { return ({
                name: undefined
            }); },
            reducers: function () { return ({
                onChangeLoad: function (state, action) {
                    return state;
                }
            }); },
            effects: function () { return ({
                onAsyncChangeName: function () {
                    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); });
                }
            }); }
        };
        var StudentModel = {
            state: function () { return ({
                name: undefined
            }); },
            reducers: function () { return ({
                onChangeLoad: function (state, action) {
                    return state;
                }
            }); },
            effects: function () { return ({
                onAsyncChangeStudentName: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log('StudentModel-effects');
                            return [2 /*return*/];
                        });
                    });
                }
            }); }
        };
        var store = index_1.create({
            initialModel: {
                user: UserModel,
                student: StudentModel
            }
        }, {
            a: {
                onReducer: function (modelName, reducerName, reducer) {
                    return function (state, action) {
                        console.log('开始');
                        var result = reducer(state, action.payload, action.meta);
                        console.log('结束');
                        return result;
                    };
                },
                onEffect: function (modelName, effectName, effect) {
                    return function (effectApi, action) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('effect开始1');
                                    return [4 /*yield*/, effect(effectApi, action)];
                                case 1:
                                    _a.sent();
                                    console.log('effect结束1');
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                }
            },
            b: {
                onReducer: function (modelName, reducerName, reducer) {
                    return function (state, action) {
                        console.log('开始1');
                        var result = reducer(state, action.payload, action.meta);
                        console.log('结束1');
                        return result;
                    };
                },
                onEffect: function (modelName, effectName, effect) {
                    return function (effectApi, action) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('effect开始2');
                                    return [4 /*yield*/, effect(effectApi, action)];
                                case 1:
                                    _a.sent();
                                    console.log('effect结束2');
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                }
            }
        });
        var actionCreator = actions_1.default({
            user: UserModel,
            student: StudentModel
        });
        store.dispatch(actionCreator.student.onAsyncChangeStudentName());
    });
    it('不传任何插件', function () {
        var UserModel = {
            state: function () { return ({
                name: undefined
            }); },
            reducers: function () { return ({
                onChangeLoad: function (state, action) {
                    return state;
                }
            }); },
            effects: function () { return ({
                onAsyncChangeName: function (effectApi, action) {
                    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); });
                }
            }); }
        };
        var store = index_1.create({
            initialModel: {
                user: UserModel
            }
        });
        expect(store.getState().user.name).toBeUndefined();
    });
});
//# sourceMappingURL=index.js.map