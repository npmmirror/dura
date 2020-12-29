import { Store, Dispatch, AnyAction } from 'redux';
import { GlobalStorage, Action } from './@types';
import { ACTION_TYPE_SEP, UPDATE_LOADING_REDUCER_NAME } from './createNamed';

function createUpdateLoading(
  store: Store,
  namespace: string,
  methodName: string,
) {
  return function (value: boolean) {
    store.dispatch({
      type: `${namespace}${ACTION_TYPE_SEP}${UPDATE_LOADING_REDUCER_NAME}`,
      payload: {
        key: methodName,
        val: value,
      },
    });
  };
}

export const createAsyncMiddleware = (global: GlobalStorage) => (
  store: Store,
) => (next: Dispatch<AnyAction>) => (
  action: Action<any, { loading?: { delay?: number } }>,
) => {
  const [namespace, methodName] = action.type.split(ACTION_TYPE_SEP);
  let effectMethod = global.effects?.[namespace]?.[methodName];
  const updateLoading = createUpdateLoading(store, namespace, methodName);
  if (action?.meta?.loading) {
    effectMethod = async () => {
      let timerId;
      if (action?.meta?.loading?.delay) {
        timerId = setTimeout(
          () => updateLoading(true),
          action?.meta?.loading?.delay,
        );
      } else {
        updateLoading(true);
      }
      await global.effects?.[namespace]?.[methodName]?.(action);
      updateLoading(false);
      clearTimeout(timerId);
    };
  }
  return effectMethod?.(action), next(action);
};
