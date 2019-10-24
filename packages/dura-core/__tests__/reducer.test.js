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
            },
            emptyAction: function (state) {
                return state;
            }
        }); },
        effects: function () { return ({}); }
    };
}
describe('测试reducers', function () {
    it('通过reducer修改state', function () {
        var UserModel = getUserModel();
        var rootModel = {
            user: UserModel
        };
        var store = index_1.create({
            initialModel: rootModel
        });
        var dispatch = store.dispatch, getState = store.getState;
        expect(getState().user.name).toBeUndefined();
        dispatch({
            type: 'user/onChangeName',
            payload: {
                newName: '张三'
            }
        });
        expect(getState().user.name).toEqual('张三');
    });
    it('空的payload和meta', function () {
        var UserModel = getUserModel();
        var rootModel = {
            user: UserModel
        };
        var store = index_1.create({
            initialModel: rootModel
        });
        var dispatch = store.dispatch, getState = store.getState;
        expect(getState().user.name).toBeUndefined();
        dispatch({
            type: 'user/emptyAction'
        });
        expect(getState().user.name).toBeUndefined();
    });
});
//# sourceMappingURL=reducer.test.js.map