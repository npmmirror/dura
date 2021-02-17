import type { Store, Action } from 'redux';
import { combineReducers } from 'redux';
import { STORAGE, CreateSliceOptions, ReducersMap } from './types';
import { createImmerReducer } from './createImmerReducer';
import { useMount } from './useMount';
import { useUnmount } from './useUnmount';

export function createUseMount<
  S,
  A extends Action,
  M extends ReducersMap<S, A>
>(options: CreateSliceOptions<S, A, M>, store: Store, storage: STORAGE) {
  const { namespace } = options;
  const immerReducer = createImmerReducer(options);
  return function () {
    const replace = () =>
      store.replaceReducer(combineReducers(storage.current.reducerMap));

    const replaceOnAdd = () => (
      (storage.current.reducerMap[namespace] = immerReducer), replace()
    );
    const replaceOnDelete = () => (
      delete storage.current.reducerMap[namespace], replace()
    );
    useMount(replaceOnAdd);
    useUnmount(replaceOnDelete);
  };
}
