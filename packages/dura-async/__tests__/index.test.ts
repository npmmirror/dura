import { create, ExtractRootState } from "@dura/core";
import { DuraStore } from "@dura/types";
import { createAsyncPlugin, AsyncDuraStore, EffectAPI } from "../src/index";

describe("单元测试", function() {
  it("测试effects", function(done) {
    const initialState = {
      name: "默认",
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
        onChangeName(state: IState, action: { payload: { name: string } }) {
          return { ...state, ...action.payload };
        }
      },
      effects: {
        /**
         * 异步的修改用户姓名
         * @param payload
         */
        async onAsyncChangeName(action: { payload: { name: string } }, request: EffectAPI) {
          await request.delay(1500);
          const oldName = request.select((state: RootState) => state.user.name);
          reducerRunner.user.onChangeName({ name: `${action.payload.name}-${oldName}` });
        }
      }
    };

    const initModel = {
      user: user,
      x: {
        state: {}
      }
    };

    type RootState = ExtractRootState<typeof initModel>;

    const store = create({
      initialModel: initModel,
      plugins: [createAsyncPlugin()]
    }) as DuraStore<typeof initModel> & AsyncDuraStore<typeof initModel>;

    const reducerRunner = store.reducerRunner;
    const effectRunner = store.effectRunner;

    expect(store.getState().user).toEqual(initialState);

    reducerRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");

    effectRunner.user.onAsyncChangeName({ name: "李四" });

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("李四-张三");
      done();
    }, 3000);
  });
});
