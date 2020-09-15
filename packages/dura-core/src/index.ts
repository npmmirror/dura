import type { PreloadedState, Store as ReduxStore } from "redux";
import type {
  ConfiguraOptions,
  JsonObject,
  StoreSlice,
  UnionToIntersection,
  ExtractStateByStoreUnion,
  ExtractAction,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  CreateStoreReturn,
} from "@dura/types";
import {
  compose as reduxCompose,
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux";
import { operatorFactory } from "./operator";
import {
  defineHiddenConstantProperty,
  DURA_STORE_EFFECTS,
  DURA_STORE_REDUCERS,
  createActionsFactory,
} from "@dura/utils";
import { enablePatches, setAutoFreeze } from "immer";
import duraStoreSlice from "./duraStoreSlice";
import { createAsyncMiddleware } from "@dura/async";

enablePatches();
setAutoFreeze(false);

export const defaultConfiguraOptions: ConfiguraOptions = {
  middlewares: [],
  enhancers: [],
  preloadedState: undefined,
  compose: reduxCompose,
};

export * from "./defineStoreSlice";

export function configura(options?: ConfiguraOptions) {
  return function create<
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>[] = StoreSlice<N, S, R, E>[],
    GA = UnionToIntersection<ExtractAction<STORES[number]>>,
    GS = UnionToIntersection<ExtractStateByStoreUnion<STORES[number]>>
  >(...stores: STORES): CreateStoreReturn<GS, GA> {
    const {
      middlewares = [],
      enhancers = [],
      compose = reduxCompose,
      preloadedState,
    } = options ?? defaultConfiguraOptions;

    const operator = operatorFactory();

    operator.use(...stores, duraStoreSlice);

    const reduxStore = createStore(
      combineReducers(operator.getReducers()),
      preloadedState,
      compose(
        applyMiddleware(
          ...middlewares,
          createAsyncMiddleware(
            (namespace, effectName) =>
              operator.getEffects()[namespace]?.[effectName]
          )
        ),
        ...enhancers
      )
    );

    const actions = createActionsFactory(reduxStore)(...stores);

    function createDuraStore() {
      const duraStore = {
        use,
        unUse,
        refresh,
        actions,
        ...reduxStore,
      };
      defineHiddenConstantProperty(
        duraStore,
        DURA_STORE_REDUCERS,
        operator.getReducers()
      );
      defineHiddenConstantProperty(
        duraStore,
        DURA_STORE_EFFECTS,
        operator.getEffects()
      );
      return duraStore;
    }

    function refresh(prefix: string) {
      reduxStore.dispatch({
        type: "@@DURA/UPDATE",
        payload: { REFRESH: prefix },
      });
      return createDuraStore();
    }

    function use(...args) {
      operator.use(...args);
      reduxStore.replaceReducer(combineReducers(operator.getReducers()));
      return createDuraStore();
    }

    function unUse(...args) {
      operator.unUse(...args);
      reduxStore.replaceReducer(combineReducers(operator.getReducers()));
      return createDuraStore();
    }

    return createDuraStore() as any;
  };
}
