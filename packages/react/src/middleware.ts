import { Store, Dispatch, AnyAction } from 'redux';
import { GlobalStorage, Action } from './@types';

export const createAsyncMiddleware = (global: GlobalStorage) => (
  store: Store,
) => (next: Dispatch<AnyAction>) => (action: Action) => {
  const [namespace, methodName] = action.type.split('/');
  const effect = global.effects?.[namespace]?.[methodName];
  effect?.(action);
  return next(action);
};
