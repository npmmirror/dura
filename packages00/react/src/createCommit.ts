import { Action, Store } from 'redux';
import { ReducersMap, CreateSliceOptions } from './types';
import { produceWithPatches } from 'immer';
export function createCommit<S, A extends Action, M extends ReducersMap<S, A>>(
  store: Store,
  options: CreateSliceOptions<S, A, M>,
) {
  return function $commit(fn) {
    const { namespace } = options;
    const [, patches] = produceWithPatches(
      store.getState()[options.namespace] as S,
      (draft) => {
        fn(draft);
      },
    );
    store.dispatch({
      type: `${namespace}/$SET_STATE`,
      payload: {},
      meta: { patches },
    });
  };
}
