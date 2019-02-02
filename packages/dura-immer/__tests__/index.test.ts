import { DuraStore, RootModel } from "@dura/types";
import { create } from "@dura/core";
import immer from "../src/index";

describe("测试immer插件", function() {
  it("xx", function() {
    const m = {
      state: {},
      reducer: {},
      effects: {
        chanegName() {}
      }
    };

    const x = {
      state: {},
      reducer: {},
      effects: {
        chanegName() {}
      }
    };

    const root = {
      m,
      x
    };

    type Root = typeof root;

    let o : Root ;

    console.log(o.m.effects.chanegName);
    



  });
  // it("测试immer插件", function() {
  //   const initialState = {
  //     name: undefined,
  //     sex: undefined
  //   };

  //   const user = {
  //     state: initialState,
  //     reducers: {
  //       onChangeName(payload: { name: string }) {
  //         return function(state) {
  //           return { ...state, ...payload };
  //         };
  //       }
  //     }
  //   };

  //   const initialModel = {
  //     user
  //   };

  //   const store = create({
  //     initialModel,
  //     plugins: [immer]
  //   }) as DuraStore<typeof initialModel>;

  //   expect(store.getState().user.name).toBeUndefined();

  //   store.reducerRunner.user.onChangeName({ name: "张三" });

  //   expect(store.getState().user.name).toEqual("张三");
  // });
});
