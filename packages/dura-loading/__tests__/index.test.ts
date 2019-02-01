import { create } from "@dura/core";
import { DuraStore } from "@dura/types";
import { EffectAPI, AsyncDuraStore, createAsyncPlugin } from "@dura/async";
import { ExtractLoadingState, LoadingMeta, createLoadingPlugin } from "../src/index";

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
        onChangeName(payload: { name: string }): any {
          return function(state) {
            return { ...state, ...payload };
          };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        onAsyncChangeName(payload: { name: string }, meta: LoadingMeta) {
          return async function(request: EffectAPI) {
            await request.delay(1000);
            console.log("onAsyncChangeName");
            store.reducerRunner.user.onChangeName(payload);
          };
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
      plugins: [createLoadingPlugin(initialModel), createAsyncPlugin()]
    }) as DuraStore<typeof initialModel, ExtractLoadingState<typeof initialModel>> &
      AsyncDuraStore<typeof initialModel>;

    expect(store.getState().user).toEqual({ name: undefined, sex: undefined });

    store.effectRunner.user.onAsyncChangeName({ name: "张三" }, { loading: true });

    console.log(store.getState());

    setTimeout(() => expect(store.getState().loading.user.onAsyncChangeName).toEqual(true), 300);

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("张三");
      expect(store.getState().loading.user.onAsyncChangeName).toEqual(false);
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
        onChangeName(payload: { name: string }): any {
          return function(state) {
            return { ...state, ...payload };
          };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        onAsyncChangeName(payload: { name: string }, meta: LoadingMeta) {
          return async function(request: EffectAPI) {
            await request.delay(1000);
            store.reducerRunner.user.onChangeName(payload);
          };
        }
      }
    };
    const initialModel = {
      /**
       * 用户模块
       */
      user,
      t: {
        state: {}
      }
    };

    const store = create({
      initialModel,
      plugins: [createLoadingPlugin(initialModel), createAsyncPlugin()]
    }) as DuraStore<typeof initialModel, ExtractLoadingState<typeof initialModel>> &
      AsyncDuraStore<typeof initialModel>;

    expect(store.getState().user).toEqual({ name: undefined, sex: undefined });

    store.effectRunner.user.onAsyncChangeName({ name: "张三" }, { loading: false });

    setTimeout(() => expect(store.getState().loading.user.onAsyncChangeName).toEqual(false), 300);

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("张三");
      expect(store.getState().loading.user.onAsyncChangeName).toEqual(false);
      done();
    }, 1500);
  });
});
