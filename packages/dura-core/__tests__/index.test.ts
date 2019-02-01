import { create } from "../src/index";
import { ExtractRootState, EffectAPI, ExtractRootActionRunner, DuraStore, Model, RootModel } from "@dura/types";

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

    /**
     * 提取effects
     * @param name
     * @param model
     */
    function extractEffects(name: string, model: Model<any>) {
      const effects = model.effects || {};
      const effectKeys = Object.keys(effects);
      const nextEffects = effectKeys
        .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
        .reduce((prev, next) => ({ ...prev, ...next }), {});
      return nextEffects;
    }

    const duraAsyncPlugin = {
      name: "asyncPlugin",
      createMiddleware(rootModel: RootModel) {
        //聚合effects
        const rootEffects = Object.keys(rootModel)
          .map((name: string) => extractEffects(name, rootModel[name]))
          .reduce((prev, next) => ({ ...prev, ...next }), {});
        const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));
        return store => next => async action => {
          let result = next(action);
          if (typeof rootEffects[action.type] === "function") {
            const dispatch = store.dispatch;
            const getState = () => store.getState();
            //执行effect
            const effect = rootEffects[action.type](action.payload, action.meta);
            result = await effect({
              dispatch,
              getState,
              delay
            });
          }
          return result;
        };
      }
    };

    const store = create({
      initialModel: initModel,
      plugins: [duraAsyncPlugin]
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
