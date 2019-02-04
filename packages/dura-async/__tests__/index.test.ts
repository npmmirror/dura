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
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      },
      effects: {
        /**
         * 异步的修改用户姓名
         * @param payload
         */
        onAsyncChangeName(payload: { name: string }) {
          return async function(request: EffectAPI<RootState>) {
            await request.delay(1500);
            reducerRunner.user.onChangeName({ name: `${payload.name}-${request.getState().user.name}` });
          };
        }
      }
    };

    const initModel = {
      user,
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
