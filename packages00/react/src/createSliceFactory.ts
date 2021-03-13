import { Action, Store } from 'redux';
import { STORAGE, ReducersMap, CreateSliceOptions, Return } from './types';
import { createUseMount } from './createUseMount';
import { createUseReducer } from './createEachUseReducer';

export function createSliceFactory(store: Store, storage: STORAGE) {
  return function createSlice<S, A extends Action, M extends ReducersMap<S, A>>(
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

    return Object.keys(reducers)
      .map(mapTo)
      .reduce((prev, next) => ({ ...prev, ...next }), {
        useMount,
      }) as any;
  };
}
