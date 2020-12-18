import { Store } from 'redux';
import { SliceReducersMapObject, Reducer, Action } from './type';

export function createDefineReducer<S>(
  name: string,
  store: Store,
  sliceReducers: SliceReducersMapObject,
) {
  return function defineReducer<P, M, F extends Reducer<S, P, M>>(fn: F) {
    sliceReducers[fn.name] = fn;
    return function(payload: P, meta?: M) {
      store.dispatch({
        type: `${name}/${fn.name}`,
        payload,
        meta: {
          reducers: Object.keys(sliceReducers).map(n => `${name}/${n}`),
        },
      });
    };
  };
}
