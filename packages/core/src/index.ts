import type { ReducersMapObject } from 'redux';
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
  EffectsMapOfStore,
  Action,
  Loading,
  ExtractLoadingTypes,
} from '@dura/types';
import {
  compose as reduxCompose,
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import {
  keys,
  createProxy,
  DURA_STORE_EFFECTS,
  DURA_STORE_REDUCERS,
  createActionsFactory,
  defineHiddenConstantProperty,
} from '@dura/utils';
import invariant from 'invariant';
import duraStoreSlice from './duraStoreSlice';
import { DURA_PATCHES_SYMBOL } from '@dura/utils';
import { createAsyncMiddleware } from '@dura/async';
import { enablePatches, setAutoFreeze, produceWithPatches } from 'immer';

enablePatches();
setAutoFreeze(false);

export const defaultConfiguraOptions: ConfiguraOptions = {
  middlewares: [],
  enhancers: [],
  preloadedState: undefined,
  compose: reduxCompose,
};

export * from './defineStoreSlice';

export function configura(options?: ConfiguraOptions) {
  return function create<
    N extends string,
    S,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>[] = StoreSlice<N, S, R, E>[],
    GA = UnionToIntersection<ExtractAction<STORES[number]>>,
    GS = UnionToIntersection<ExtractStateByStoreUnion<STORES[number]>> & {
      DURA: {
        LOADING: UnionToIntersection<ExtractLoadingTypes<STORES[number]>>;
      };
    }
  >(...stores: STORES): CreateStoreReturn<GS, GA> {
    const {
      middlewares = [],
      enhancers = [],
      compose = reduxCompose,
      preloadedState,
    } = options ?? defaultConfiguraOptions;

    const globalReducers: ReducersMapObject = {};
    const globalEffects: EffectsMapOfStore = {};
    const globalWatchs: any = {};

    function UNSAFE_use<
      N extends string,
      S,
      R extends ReducersMapOfStoreSlice<S>,
      E extends EffectsMapOfStoreSlice,
      STORES extends StoreSlice<N, S, R, E>[]
    >(...args: STORES) {
      let index = -1;
      while (++index < args.length) {
        const store = args[index];
        invariant(
          !UNSAFE_has(store),
          'store already exists, please note that the namespace needs to be unique!',
        );
        globalReducers[store.namespace] = function (
          state = store.state,
          action,
        ) {
          const [, reducerName] = action.type.split('/');
          const [nextState, patches] = produceWithPatches(function (
            draftState,
          ) {
            store.reducers[reducerName]?.(draftState, action as any);
          })(state);

          const patchesOfStringify = patches.map(
            (n) => `${store.namespace}.${n.path.join('.')}`,
          );

          defineHiddenConstantProperty(
            nextState,
            DURA_PATCHES_SYMBOL,
            patchesOfStringify,
          );

          keys(store.watchs ?? {}).forEach((x) => {
            let watch = store.watchs[x];
            if (!watch || typeof watch !== 'function') {
              return;
            }
            const PATHCHE: Map<string, number> = watch[DURA_PATCHES_SYMBOL];
            const deps = new Map<string, number>();
            const proxy = createProxy(nextState, deps, store.namespace);
            if (PATHCHE?.size === 0 && patchesOfStringify?.length !== 0) {
              watch(proxy);
              defineHiddenConstantProperty(watch, DURA_PATCHES_SYMBOL, deps);
              return;
            }

            if (patchesOfStringify.some((n: string) => PATHCHE.has(n))) {
              watch(proxy);
              defineHiddenConstantProperty(watch, DURA_PATCHES_SYMBOL, deps);
              return;
            }
          });

          return nextState;
        };
        globalWatchs[store.namespace] = store.watchs;
        globalEffects[store.namespace] = store.effects;
      }
    }

    function UNSAFE_has<
      N extends string,
      S extends JsonObject,
      R extends ReducersMapOfStoreSlice<S>,
      E extends EffectsMapOfStoreSlice,
      STORES extends StoreSlice<N, S, R, E>
    >(store: STORES) {
      return store.namespace in globalReducers;
    }

    function UNSAFE_unUse<
      N extends string,
      S extends JsonObject,
      R extends ReducersMapOfStoreSlice<S>,
      E extends EffectsMapOfStoreSlice,
      STORES extends StoreSlice<N, S, R, E>[]
    >(...args: STORES) {
      let index = -1;
      while (++index < args.length) {
        const store = args[index];
        delete globalReducers[store.namespace];
        delete globalEffects[store.namespace];
      }
    }

    UNSAFE_use(...stores, duraStoreSlice);

    const reduxStore = createStore(
      combineReducers(globalReducers),
      preloadedState,
      compose(
        applyMiddleware(
          ...middlewares,
          createAsyncMiddleware(
            (namespace, effectName) => globalEffects[namespace]?.[effectName],
          ),
        ),
        ...enhancers,
      ),
    );

    const createActions = createActionsFactory(reduxStore);

    const globalActions = createActions(...stores) as any;

    const duraStore = {
      use,
      unUse,
      refresh,
      actions: globalActions,
      ...reduxStore,
    };
    defineHiddenConstantProperty(
      duraStore,
      DURA_STORE_REDUCERS,
      globalReducers,
    );
    defineHiddenConstantProperty(duraStore, DURA_STORE_EFFECTS, globalEffects);

    function refresh(prefix: string) {
      reduxStore.dispatch({
        type: 'DURA/UPDATE',
        payload: { REFRESH: prefix },
      });
      return duraStore;
    }

    function use(...args) {
      UNSAFE_use(...args);
      const actionSlice = createActions(...args);
      duraStore.actions = { ...duraStore.actions, ...actionSlice };
      reduxStore.replaceReducer(combineReducers(globalReducers));
      return duraStore;
    }

    function unUse(...args) {
      UNSAFE_unUse(...args);
      let index = -1;
      while (++index < args.length) {
        const element = args[index];
        delete duraStore.actions[element.namespace];
      }
      reduxStore.replaceReducer(combineReducers(globalReducers));
      return duraStore;
    }

    return duraStore as any;
  };
}
