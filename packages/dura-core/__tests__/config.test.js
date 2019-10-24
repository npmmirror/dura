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
var index_1 = require("../src/index");
function getUserModel() {
    return {
        state: function () { return ({
            name: undefined
        }); },
        reducers: function () { return ({
            onChangeName: function (state, payload) {
                return __assign(__assign({}, state), { name: payload.newName });
            }
        }); },
        effects: function () { return ({}); }
    };
}
describe('测试配置信息', function () {
    it('测试initialModel', function () {
        var store = index_1.create({
            initialModel: {
                user: getUserModel()
            }
        });
        expect(store.getState().user.name).toBeUndefined();
    });
    it('测试额外的reducers', function () {
        var store = index_1.create({
            initialModel: {
                user: getUserModel()
            },
            extraReducers: {
                router: function (state, action) {
                    if (state === void 0) { state = { path: '/home' }; }
                    switch (action.type) {
                        case 'changePath':
                            return __assign(__assign({}, state), { path: action.payload.path });
                        default:
                            return state;
                    }
                }
            }
        });
        expect(store.getState()['router']).toEqual({ path: '/home' });
        store.dispatch({
            type: 'changePath',
            payload: {
                path: '/user'
            }
        });
        expect(store.getState()['router']).toEqual({ path: '/user' });
    });
    it('测试initialState', function () {
        var store = index_1.create({
            initialModel: {
                user: getUserModel()
            },
            initialState: {
                user: {
                    name: '张三'
                }
            }
        });
        expect(store.getState().user.name).toEqual('张三');
    });
    it('测试传入中间件', function () {
        var rootModel = {
            user: getUserModel()
        };
        var store = index_1.create({
            initialModel: rootModel,
            middlewares: [function (store) { return function (next) { return function (action) { return next(__assign(__assign({}, action), { type: 'h' })); }; }; }]
        });
        var dispatch = store.dispatch, getState = store.getState;
        expect(getState().user.name).toBeUndefined();
        dispatch({
            type: 'user/onChangeName',
            payload: {
                newName: '张三'
            }
        });
        expect(getState().user.name).toBeUndefined();
    });
    it('测试传入compose', function () {
        var storeCreator = function () {
            return index_1.create({
                initialModel: {
                    user: getUserModel()
                },
                middlewares: [
                    function (store) { return function (next) { return function (action) { return next(__assign(__assign({}, action), { type: 'h' })); }; }; }
                ],
                compose: function () {
                    var funcs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        funcs[_i] = arguments[_i];
                    }
                    if (1 == 1) {
                        throw '异常';
                    }
                    if (funcs.length === 0) {
                        return function (arg) { return arg; };
                    }
                    if (funcs.length === 1) {
                        return funcs[0];
                    }
                    return funcs.reduce(function (a, b) { return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return a(b.apply(void 0, args));
                    }; });
                }
            });
        };
        expect(function () { return storeCreator(); }).toThrow('异常');
    });
    it('测试传入createStore', function () {
        var store = index_1.create({
            initialModel: {
                user: getUserModel()
            },
            createStore: function () { return false; }
        });
        expect(store.getState).toBeUndefined();
    });
});
//# sourceMappingURL=config.test.js.map