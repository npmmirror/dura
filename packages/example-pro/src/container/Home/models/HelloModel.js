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
Object.defineProperty(exports, "__esModule", { value: true });
var _store_1 = require("@store");
var initialState = function () {
    return {
        name: '张三',
        userList: [],
        articleList: [
            {
                id: 1,
                title: '文章标题',
                context: '马云退休了'
            },
            {
                id: 2,
                title: '苹果发布会',
                context: '浴霸来了'
            }
        ]
    };
};
var reducers = function () {
    return {
        onChangeName: function (state, payload) {
            state.name = payload.nextName;
        },
        /**
         * 更改item选项
         * @param state
         * @param payload
         */
        onChangeItem: function (state, payload) {
            var item = state.articleList.find(function (n) { return n.id === payload.id; });
            item.title = payload.title;
            // state.articleList.push({id:12,title:'测试',context:'测试'})
        },
        onChangeUserList: function (state, payload) {
            state.userList = payload.userList;
        }
    };
};
var effects = function (dispatch, getState, delay) {
    return {
        onAsyncQueryUserList: function (payload, meta) {
            return __awaiter(this, void 0, void 0, function () {
                var res, rootState;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, delay(1000)];
                        case 1:
                            res = _a.sent();
                            rootState = getState();
                            rootState.user.name;
                            dispatch(_store_1.actionCreator.hello.onChangeUserList({ userList: [{ name: '' }] }));
                            dispatch(_store_1.actionCreator.hello.onChangeUserList({ userList: res.userList }));
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
};
exports.default = {
    state: initialState,
    reducers: reducers,
    effects: effects
};
//# sourceMappingURL=HelloModel.js.map