import { create } from "../src";
import { UnionToIntersection, ExtractState } from "@dura/core";

describe("测试plus", function() {
  it("测试插件额外的model", function() {
    const UserModel = {
      state: {
        name: undefined
      },
      reducers: {
        onChangeLoad(state, action) {
          return state;
        }
      },
      effects: {
        async onAsyncChangeName(effectApi, action) {}
      }
    };

    const plugins = {
      loading: {
        extraModel: {
          loading: {
            state: {
              name: "测试loading"
            },
            reducers: {
              loadingChange(state, action) {
                return state;
              }
            },
            effects: {}
          }
        }
      },
      immer: {
        extraModel: {
          immer: {
            state: {
              name: "测试immer"
            },
            reducers: {
              immerChange(state, action) {
                return state;
              }
            },
            effects: {}
          }
        }
      }
    };
    const store = create(
      {
        initialModel: {
          user: UserModel
        }
      },
      plugins
    );

    expect(store.getState().loading.name).toEqual("测试loading");
  });
  it("测试插件", function() {
    const UserModel = {
      state: {
        name: undefined
      },
      reducers: {
        onChangeLoad(state, action) {
          return state;
        }
      },
      effects: {
        async onAsyncChangeName(effectApi, action) {}
      }
    };

    const store = create(
      {
        initialModel: {
          user: UserModel
        }
      },
      {
        a: {
          onReducer: (modelName, reducerName, reducer) => {
            return (state, action) => {
              console.log("开始");
              const result = reducer(state, action);
              console.log("结束");
              return result;
            };
          },
          onEffect: (modelName, effectName, effect) => {
            return async (effectApi, action) => {
              await effect(effectApi, action);
            };
          }
        },
        b: {
          onReducer: (modelName, reducerName, reducer) => {
            return (state, action) => {
              console.log("开始1");
              const result = reducer(state, action);
              console.log("结束1");
              return result;
            };
          }
        }
      }
    );

    store.dispatch(store.actionCreator.user.onChangeLoad({}, {}));
  });

  it("不传任何插件", function() {
    const UserModel = {
      state: {
        name: undefined
      },
      reducers: {
        onChangeLoad(state, action) {
          return state;
        }
      },
      effects: {
        async onAsyncChangeName(effectApi, action) {}
      }
    };

    const store = create({
      initialModel: {
        user: UserModel
      }
    });

    expect(store.getState().user.name).toBeUndefined();
  });
});
