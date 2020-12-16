import { Store } from 'redux';

export function createDefineReducer(
  name: string,
  store: Store,
  sliceReducers: SliceReducersMapObject,
) {
  return function defineReducer(fn: Reducer) {
    sliceReducers[fn.name] = fn;
    return function(args: any) {
      store.dispatch({
        type: `${name}/${fn.name}`,
        ...args,
        meta: {
          reducers: Object.keys(sliceReducers).map(n => `${name}/${n}`),
        },
      });
    };
  };
}
