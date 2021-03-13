import { combineReducers } from 'redux';
import type { StoreEnhancer } from 'redux';
import {
  STORAGE,
  ReducersMap,
  Action,
  CreateSliceOptions,
  Return,
} from './types';
import { createUseReducer } from './createEachUseReducer';
import { createUseMount } from './createUseMount';
import merge from 'lodash.merge';

export type DuraEnhancer = StoreEnhancer<{
  createSlice: <S, A extends Action, M extends ReducersMap<S, A>>(
    options: CreateSliceOptions<S, A, M>,
  ) => Return<S, M>;
}>;

export function createDuraEnhancer(): DuraEnhancer {
  const storage: STORAGE = {
    current: {
      reducerMap: {
        D: (state = {}) => state,
      },
    },
  };
  return function duraEnhancer(createStore) {
    return function (reducer, preloadedState) {
      const store = createStore(
        combineReducers({ ...storage.current.reducerMap, ...reducer }),
        preloadedState,
      );
      function createSlice<S, A extends Action, M extends ReducersMap<S, A>>(
        options: CreateSliceOptions<S, A, M>,
      ): Return<S, M> {
        const { reducers = {}, namespace } = options;
        const useMount = createUseMount(options, store, storage);
        const mapTo = (name: string) => {
          const execute = (payload, meta) =>
            store.dispatch({ type: `${namespace}/${name}`, payload, meta });
          const use = createUseReducer(execute);
          return { [name]: { use, run: execute } };
        };
        return Object.keys(reducers).map(mapTo).reduce(merge, {
          useMount,
        }) as any;
      }

      return {
        ...store,
        createSlice,
      };
    };
  } as any;
}

export * from './types';
export * from './useAsync';
