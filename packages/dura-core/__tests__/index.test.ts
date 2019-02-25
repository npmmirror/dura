import { create, EffectAPI } from "../src/index";

describe("单元测试", function() {
  it("测试传入第三方createStore", function(done) {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(state: IState, action: { payload?: { name: string } }) {
          return { ...state, ...action.payload };
        }
      },
      effects: {
        async onAsyncChangeName(effectApi: EffectAPI, action: { payload?: { name: string } }) {
          await effectApi.delay(2000);
          effectApi.dispatch(store.actions.user.onChangeName(action.payload));
        }
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel
    });

    expect(store.getState().user.name).toBeUndefined();

    const _action = store.actions.user.onAsyncChangeName({ name: "张三" });

    store.dispatch(_action);

    expect(store.getState().user.name).toBeUndefined();

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("张三");
      done();
    }, 3000);
  });
});
