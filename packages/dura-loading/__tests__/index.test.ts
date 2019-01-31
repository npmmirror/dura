import { create, createActionCreator } from "@dura/core";
import { ERequest, ExtractRootState, ExtractRootAction, DuraStore } from "@dura/types";
import loading, { ExtractLoadingState, LoadingMeta } from "../src/index";

describe("测试loading 插件", function() {
  it("测试loading 插件", function(done) {
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
        async onAsyncChangeName(request) {
          const { delay, dispatch, action } = request as ERequest<{ name: string }, RootState, LoadingMeta>;
          await delay(1500);
          dispatch(actionCreator.user.onChangeName(action.payload));
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

    type RootAction = ExtractRootAction<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel> & ExtractLoadingState<typeof initialModel>;

    const store = create({
      initialModel,
      plugins: [loading]
    }) as DuraStore<RootState>;

    const actionCreator = createActionCreator(initialModel) as RootAction;

    expect(store.getState().user).toEqual({ name: undefined, sex: undefined });

    store.dispatch(actionCreator.user.onAsyncChangeName({ name: "张三" }, { loading: true }));

    setTimeout(() => expect(store.getState().loading.user.onAsyncChangeName).toEqual(true), 300);

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("张三");
      expect(store.getState().loading.user.onAsyncChangeName).toEqual(false);
      done();
    }, 2000);
  });
});
