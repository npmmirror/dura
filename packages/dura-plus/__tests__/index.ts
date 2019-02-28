import { create } from "../src";

describe("测试plus", function() {
  it("简单的测试", function() {
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
      [
        {
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
        {
          onReducer: (modelName, reducerName, reducer) => {
            return (state, action) => {
              console.log("开始1");
              const result = reducer(state, action);
              console.log("结束1");
              return result;
            };
          }
        }
      ]
    );

    store.dispatch(store.actionCreator.user.onChangeLoad({}, {}));
  });
});
