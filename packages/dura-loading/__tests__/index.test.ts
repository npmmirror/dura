import { create } from "@dura/core";
import { RequestForEffect, ExtractDispatch, ExtractRootState, RootModel, ExtractRootEffects } from "@dura/types";
import loading from "../src/index";

describe("ddd", function() {
  it("xx", function() {
    const user = {
      state: {
        /**
         * 姓名
         */
        name: undefined,
        sex: undefined
      },
      reducers: {
        onChangeName(state: any, action: any): any {
          state.name = action.payload.name;
          return { ...state, ...action.payload };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        async onAsyncChangeName(request: RequestForEffect<{ name: string }, {}>) {
          const dispatch = request.dispatch as Dispatch,
            action = request.action,
            rootState = request.getState() as RootState;
          dispatch.user.onChangeName(action.payload);
        }
      }
    };

    const initialModel = {
      /**
       * 用户模块
       */
      user: user,
      test: {
        state: {
          test: "xx"
        },
        effects: {
          onAsyncTestFunc() {}
        }
      }
    };
    type ExtractLoadingState<RMT extends RootModel> = {
      loading: ExtractRootEffects<RMT>;
    };
    type Dispatch = ExtractDispatch<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel> & ExtractLoadingState<typeof initialModel>;

    const store = create({
      initialModel,
      plugins: [loading]
    });

    console.log(store.dispatch);

    let state = store.getState() as RootState;

    const ac = store.dispatch as Dispatch;

    ac.user.onAsyncChangeName({ name: "章三" }, { loading: true });

    console.log(store.getState());
  });
});
