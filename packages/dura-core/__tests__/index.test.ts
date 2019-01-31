import { create, createActionCreator } from "../src/index";
import {
  ExtractRootState,
  EffectAPI,
  Plugin,
  Model,
  DuraAction,
  ExtractRootActionRunner,
  DuraStore,
  Payload,
  Reducers
} from "@dura/types";

describe("单元测试", function() {
  it("测试reducers", function() {
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
            actionCreator.user.onChangeName(payload);
          };
        }
      }
    };

    const initModel = {
      user
    };

    type RootState = ExtractRootState<typeof initModel>;
    type RootAction = ExtractRootActionRunner<typeof initModel>;

    const store = create({
      initialModel: initModel
    }) as DuraStore<RootState, RootAction>;

    const actionCreator = store.actionRunner;

    expect(store.getState().user).toEqual(initialState);

    actionCreator.user.onAsyncChangeName({ name: "李四" });

    console.log(store.getState().user);

    expect(store.getState().user.name).toEqual("李四");
  });
});
