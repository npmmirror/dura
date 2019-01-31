import { DuraAction, ExtractRootAction, DuraStore, ExtractRootState } from "@dura/types";
import { create, createActionCreator } from "@dura/core";
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
        onChangeName(state: typeof initialState, action: DuraAction<{ name: string }>) {
          state.name = action.payload.name;
        }
      }
    };

    const initialModel = {
      user
    };

    const store = create({
      initialModel,
      plugins: [immer]
    }) as DuraStore<RootState>;

    type RootAction = ExtractRootAction<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel>;

    const actionCreator = createActionCreator(initialModel) as RootAction;

    expect(store.getState().user.name).toBeUndefined();

    store.dispatch(actionCreator.user.onChangeName({ name: "张三" }));

    expect(store.getState().user.name).toEqual("张三");
  });
});
