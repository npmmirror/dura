"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var plus_1 = require("@dura/plus");
var index_1 = require("../src/index");
var actions_1 = __importDefault(require("@dura/actions"));
describe('测试immer插件', function () {
    it('测试immer插件', function () {
        var initialState = {
            name: undefined,
            sex: undefined,
            addressList: [
                {
                    province: undefined
                },
                {
                    province: '安徽'
                }
            ]
        };
        var user = {
            state: function () { return initialState; },
            reducers: function () { return ({
                onChangeName: function (state, payload) {
                    state.addressList[0].province = payload.provinceName;
                }
            }); },
            effects: function () { return ({}); }
        };
        var initialModel = {
            user: user
        };
        var store = plus_1.create({
            initialModel: initialModel
        }, {
            immer: index_1.createImmerPlugin()
        });
        var getState = store.getState, dispatch = store.dispatch;
        var actionCreator = actions_1.default(initialModel);
        expect(getState().user.addressList[0].province).toBeUndefined();
        dispatch(actionCreator.user.onChangeName({ provinceName: '江苏' }));
        expect(getState().user.addressList[0].province).toEqual('江苏');
    });
});
//# sourceMappingURL=index.test.js.map