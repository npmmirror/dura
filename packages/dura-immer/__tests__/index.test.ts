import { ExtractRootActionRunner, DuraStore, ExtractRootState } from "@dura/types";
import { create } from "@dura/core";
import immer from "../src/index";

describe("测试immer插件", function() {
  it("测试immer插件", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    const user = {
      state: initialState,
      reducers: {
        onChangeName(payload: { name: string }) {
          return function(state) {
            return { ...state, ...payload };
          };
        }
      }
    };

    const initialModel = {
      user
    };

    const store = create({
      initialModel,
      plugins: [immer]
    }) as DuraStore<RootState, RootAction>;

    type RootAction = ExtractRootActionRunner<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel>;

    expect(store.getState().user.name).toBeUndefined();

    store.actionRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");
  });
});
