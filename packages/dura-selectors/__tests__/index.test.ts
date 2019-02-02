import { createSelectorsPlugin, SelectorsDuraStore } from "../src/index";
import { create } from "@dura/core";
import { DuraStore, ExtractRootState } from "@dura/types";
import { createSelector } from "reselect";

describe("单元测试", function() {
  it("测试selector", function() {
    const initialState = {
      name: "",
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
      selectors: {
        total() {
          return createSelector(
            (state: RootState) => state.user.name,
            name => name + "12"
          );
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
      plugins: [createSelectorsPlugin()]
    }) as DuraStore<typeof initModel> & SelectorsDuraStore<typeof initModel>;

    expect(store.selectorRunner.user.total(store.getState())).toEqual("12");

    store.reducerRunner.user.onChangeName({ name: "李四" });

    expect(store.selectorRunner.user.total(store.getState())).toEqual("李四12");
  });
});
