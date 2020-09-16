import type { ReducersMapObject } from "redux";
import type {
  JsonObject,
  StoreSlice,
  EffectsMapOfStore,
  EffectsMapOfStoreSlice,
  ReducersMapOfStoreSlice,
  StoreSliceMap,
} from "@dura/types";
import invariant from "invariant";
import { produceWithPatches } from "immer";
import {
  defineHiddenConstantProperty,
  DURA_PATCHES_SYMBOL,
  createActionsFactory,
} from "@dura/utils";

export function operatorFactory() {
  const globalReducers: ReducersMapObject = {};
  const globalEffects: EffectsMapOfStore = {};
  const globalStoreSlice: StoreSliceMap<any, any, any, any> = {};

  function has<
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>
  >(store: STORES) {
    return store.namespace in globalStoreSlice;
  }

  function getReducers() {
    return globalReducers;
  }

  function getEffects() {
    return globalEffects;
  }

  function use<
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>[]
  >(...storeArray: STORES) {
    let index = -1;
    while (++index < storeArray.length) {
      const store = storeArray[index];

      invariant(
        !has(store),
        "store already exists, please note that the namespace needs to be unique!"
      );
      globalReducers[store.namespace] = function (state = store.state, action) {
        const [, reducerName] = action.type.split("/");

        const [nextState, patches] = produceWithPatches(function (draftState) {
          store.reducers[reducerName]?.(draftState, action);
        })(state);

        const patchesOfStringify = patches.map(
          (n) => `${store.namespace}.${n.path.join(".")}`
        );
        defineHiddenConstantProperty(
          nextState,
          DURA_PATCHES_SYMBOL,
          patchesOfStringify
        );
        return nextState;
      };
      globalEffects[store.namespace] = store.effects;
      globalStoreSlice[store.namespace] = store;
    }
  }

  function unUse<
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S>,
    E extends EffectsMapOfStoreSlice,
    STORES extends StoreSlice<N, S, R, E>[]
  >(...storeArray: STORES) {
    let index = -1;
    while (++index < storeArray.length) {
      const store = storeArray[index];
      delete globalReducers[store.namespace];
      delete globalEffects[store.namespace];
      delete globalStoreSlice[store.namespace];
    }
  }

  return {
    use,
    unUse,
    getReducers,
    getEffects,
    has,
  };
}
