import { create } from "@dura/core";
import { EffectAPI, ExtractRootState, ExtractRootActionRunner, DuraStore } from "@dura/types";
import duraAsyncPlugin from "../src/index";

describe("单元测试", function() {
  it("测试effect", function(done) {
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
            actionRunner.user.onChangeName(payload);
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
    type RootAction = ExtractRootActionRunner<typeof initModel>;

    const store = create({
      initialModel: initModel,
      plugins: [duraAsyncPlugin]
    }) as DuraStore<RootState, RootAction>;

    const actionRunner = store.actionRunner;

    expect(store.getState().user).toEqual(initialState);

    actionRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");

    actionRunner.user.onAsyncChangeName({ name: "李四" });

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("李四");
      done();
    }, 3000);
  });
});
