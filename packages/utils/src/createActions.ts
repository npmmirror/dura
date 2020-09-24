import type { Store as ReduxStore } from 'redux';
import type {
  StoreSlice,
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  ExtractAction,
  UnionToIntersection,
  Meta,
} from '@dura/types';
import { noop } from './noop';
import { merge } from './merge';
import { keys } from './keys';

export function createDispatch<S>(
  reduxStore: ReduxStore<S>,
  namespace: string,
  methodName: string,
) {
  const cache = new Map<string, any>();

  return function (payload, meta?: Meta) {
    const type = `${namespace}/${methodName}`;
    reduxStore.dispatch({ type, payload, meta });
    // const dispatchFn = () =>
    //   reduxStore.dispatch({
    //     type: `${namespace}/${methodName}`,
    //     payload,
    //   });
    // if (meta?.debounce) {
    //   dispatchDebounce(cache, type, meta.debounce, dispatchFn);
    // } else if (meta?.throttle) {
    //   dispatchThrottle(cache, type, meta.throttle, dispatchFn);
    // } else if (meta?.loading) {
    //   if (typeof meta?.loading === 'boolean') {
    //     reduxStore.dispatch({
    //       type: 'DURA/CHANGE_LOADING',
    //       payload: {
    //         k: type,
    //         value: true,
    //       },
    //     });
    //     reduxStore.dispatch({
    //       type: 'DURA/CHANGE_LOADING',
    //       payload: {
    //         k: type,
    //         value: false,
    //       },
    //     });
    //   }
    // } else {
    //   dispatchFn();
    // }
  };
}

export function createActionsFactory<S>(reduxStore: ReduxStore<S>) {
  return function <
    N extends string,
    S extends JsonObject,
    R extends ReducersMapOfStoreSlice<S> = {},
    E extends EffectsMapOfStoreSlice = {},
    STORES extends StoreSlice<N, S, R, E>[] = StoreSlice<N, S, R, E>[],
    RETURN = UnionToIntersection<ExtractAction<STORES[number]>>
  >(...stores: STORES): RETURN {
    return stores
      .map((store) => ({
        [store.namespace]: keys(merge(store.reducers, store.effects))
          .map((methodName) => ({
            [methodName]: createDispatch(
              reduxStore,
              store.namespace,
              methodName,
            ),
          }))
          .reduce(merge, noop()),
      }))
      .reduce(merge, noop()) as any;
  };
}
