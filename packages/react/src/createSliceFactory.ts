import { Action, Store } from 'redux';
import { STORAGE, ReducersMap, CreateSliceOptions, Return } from './types';
import { createUseMount } from './createUseMount';
import { createEachUseReducer } from './createEachUseReducer';
import { enablePatches, applyPatches } from 'immer';
import { createCommit } from './createCommit';

enablePatches();

export function createSliceFactory(store: Store, storage: STORAGE) {
  return function createSlice<S, A extends Action, M extends ReducersMap<S, A>>(
    options: CreateSliceOptions<S, A, M>,
  ): Return<S, M> {
    const { reducers = {} } = options;
    options.reducers['$SET_STATE'] = function (state, action: any) {
      return applyPatches(state, action.meta.patches);
    };
    const useMount = createUseMount(options, store, storage);
    const $commit = createCommit(store, options);

    return Object.keys(reducers)
      .map(createEachUseReducer(store, options))
      .reduce((prev, next) => ({ ...prev, ...next }), {
        useMount,
        $commit,
      }) as any;
  };
}
