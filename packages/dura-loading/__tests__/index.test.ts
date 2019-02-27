import { create, EffectApi } from "@dura/core";
import { createLoading } from "../src/index";

describe("测试loading 插件", function() {
  it("测试loading 插件,启用loading", function(done) {
    const user = {
      state: {
        /**
         * 姓名
         */
        name: undefined,
        sex: undefined
      },
      reducers: {
        onChangeName(state, action: { payload: { name: string } }): any {
          return { ...state, ...action.payload };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        async onAsyncChangeName(
          effectApi: EffectApi,
          action: { payload: { name: string }; meta: { loading: boolean } }
        ) {
          await effectApi.delay(1000);
          effectApi.dispatch(actionCreator.user.onChangeName(action.payload));
        }
      }
    };
    const initialModel = {
      /**
       * 用户模块
       */
      user
    };

    const store = create({
      initialModel,
      plugins: {
        loading: createLoading(initialModel)
      }
    });

    const { actionCreator, getState, dispatch } = store;

    expect(getState().user).toEqual({ name: undefined, sex: undefined });

    dispatch(actionCreator.user.onAsyncChangeName({ name: "张三" }, { loading: true }));
    console.log(getState());

    setTimeout(() => expect(getState().loading.user.onAsyncChangeName).toEqual(true), 300);

    setTimeout(() => {
      expect(getState().user.name).toEqual("张三");
      expect(getState().loading.user.onAsyncChangeName).toEqual(false);
      done();
    }, 1500);
  });

  it("测试loading 插件,不启用loading", function(done) {
    const user = {
      state: {
        /**
         * 姓名
         */
        name: undefined,
        sex: undefined
      },
      reducers: {
        onChangeName(state, action: { payload: { name: string } }): any {
          return { ...state, ...action.payload };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        async onAsyncChangeName(
          effectApi: EffectApi,
          action: { payload: { name: string }; meta: { loading: boolean } }
        ) {
          await effectApi.delay(1000);
          effectApi.dispatch(actionCreator.user.onChangeName(action.payload));
        }
      }
    };
    const initialModel = {
      /**
       * 用户模块
       */
      user,
      t: {
        state: {},
        reducers: {},
        effects: {}
      }
    };

    const store = create({
      initialModel,
      plugins: {
        loading: createLoading(initialModel)
      }
    });

    const { actionCreator, dispatch, getState } = store;

    expect(getState().user).toEqual({ name: undefined, sex: undefined });

    dispatch(actionCreator.user.onAsyncChangeName({ name: "张三" }, { loading: false }));

    setTimeout(() => expect(getState().loading.user.onAsyncChangeName).toEqual(false), 300);

    setTimeout(() => {
      expect(getState().user.name).toEqual("张三");
      expect(getState().loading.user.onAsyncChangeName).toEqual(false);
      done();
    }, 1500);
  });
});
