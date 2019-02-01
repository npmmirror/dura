import { create } from "@dura/core";
import {  ExtractRootState,  DuraStore } from "@dura/types";
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
            store.actionRunner.user.onChangeName(payload);
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

    type RootAction = ExtractRootActionRunner<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel> & ExtractLoadingState<typeof initialModel>;

    const store = create({
      initialModel,
      plugins: [createLoadingPlugin(initialModel)]
    }) as DuraStore<RootState, RootAction>;

    expect(store.getState().user).toEqual({ name: undefined, sex: undefined });

    store.actionRunner.user.onAsyncChangeName({ name: "张三" }, { loading: true });

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
            store.actionRunner.user.onChangeName(payload);
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

    type RootAction = ExtractRootActionRunner<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel> & ExtractLoadingState<typeof initialModel>;

    const store = create({
      initialModel,
      plugins: [createLoadingPlugin(initialModel)]
    }) as DuraStore<RootState, RootAction>;

    expect(store.getState().user).toEqual({ name: undefined, sex: undefined });

    store.actionRunner.user.onAsyncChangeName({ name: "张三" }, { loading: false });

    const onAsyncChangeName =
      (store.getState() &&
        store.getState().loading &&
        store.getState().loading.user &&
        store.getState().loading.user.onAsyncChangeName) ||
      false;

    setTimeout(() => expect(onAsyncChangeName).toEqual(false), 300);

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("张三");
      expect(onAsyncChangeName).toEqual(false);
      done();
    }, 1500);
  });
});
