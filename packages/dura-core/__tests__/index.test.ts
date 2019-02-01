import { create } from "../src/index";
import { ExtractRootState, EffectAPI, ExtractReducersRunner, Plugin, DuraStore, RootModel, Model } from "@dura/types";
import { createSelector } from "reselect";

describe("单元测试", function() {
  it("测试reducers", function() {
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
            reducerRunner.user.onChangeName(payload);
          };
        }
      },
      selectors: {
        total() {
          return createSelector(
            (state: RootState) => state.user.name,
            name => name + "12"
          );
        }
      }
    };

    const initModel = {
      user
    };

    function createSelectors(rootModel: RootModel): Plugin {
      const extractSelectors = function(name: string, model) {
        const { selectors = {} } = model;
        return Object.keys(selectors)
          .map((name: string) => ({ [name]: selectors[name]() }))
          .reduce((prev, next) => ({ ...prev, ...next }), {});
      };
      const rootModelKeys = Object.keys(rootModel);
      const selectors = rootModelKeys
        .map((name: string) => ({
          [name]: extractSelectors(name, rootModel[name])
        }))
        .reduce((prev, next) => ({ ...prev, ...next }), {});

      return {
        name: "selectors",
        onStoreCreated(store: DuraStore) {
          store["selectorRunner"] = selectors;
        }
      };
    }

    type RootState = ExtractRootState<typeof initModel>;

    type RootSelector = ExtractRootSelectorRunner<typeof initModel>;

    type SelectorsDuraStore<S = any> = {
      selectorRunner: S;
    };

    type SelectorModel = {
      selectors?: Selectors;
    } & Model;

    type Selectors = {
      [name: string]: any;
    };

    type ExtractSelectorRunner<S extends Selectors> = { [key in keyof S]: (state: any) => S[key] };

    type ExtractRootSelectorRunner<M extends RootModel<SelectorModel>> = {
      [key in keyof M]: ExtractSelectorRunner<M[key]["selectors"]>
    };

    const store = create({
      initialModel: initModel,
      plugins: [createSelectors(initModel)]
    }) as DuraStore<typeof initModel> & SelectorsDuraStore;

    const reducerRunner = store.reducerRunner;

    const selectorRunner = store.selectorRunner as RootSelector;

    reducerRunner.user.onChangeName({ name: "李四" });

    console.log(selectorRunner.user.total(store.getState()));

    reducerRunner.user.onChangeName({ name: "张三" });

    console.log(selectorRunner.user.total(store.getState()));
  });
});
