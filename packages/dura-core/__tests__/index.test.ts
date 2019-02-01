import { create } from "../src/index";
import { ExtractRootState, EffectAPI, ExtractRootActionRunner, DuraStore, Model } from "@dura/types";

describe("单元测试", function() {
  it("测试reducers", function(done) {
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
            await request.delay(1500);
            console.log("onAsyncChangeName");

            actionRunner.user.onChangeName(payload);
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
      initialModel: initModel,
      plugins: [
        {
          name: "loading",
          wrapModel(name: string, model: Model): Model {
            const { state, reducers, effects } = model;

            const nextEffects = Object.keys(effects)
              .map((key: string) => ({
                [key]: (payload?: any, meta?: any) => async (request: EffectAPI) => {
                  console.log("开始");

                  await effects[key](payload, meta)(request);

                  console.log("结束");
                }
              }))
              .reduce((prev, next) => ({ ...prev, ...next }), {});

            console.log(nextEffects);

            return {
              state,
              reducers,
              effects: nextEffects
            };
          }
        }
      ]
    }) as DuraStore<RootState, RootAction>;

    const actionRunner = store.actionRunner;

    expect(store.getState().user).toEqual(initialState);

    actionRunner.user.onAsyncChangeName({ name: "李四" });

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("李四");
      done();
    }, 3000);
  });
});
