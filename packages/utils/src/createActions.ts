import type { Store as ReduxStore } from 'redux';
import type {
  StoreSlice,
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  ExtractAction,
  UnionToIntersection,
  Meta,
  Action,
} from '@dura/types';
import { noop } from './noop';
import { merge } from './merge';
import { keys } from './keys';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

export function createDispatch<S>(
  reduxStore: ReduxStore<S>,
  namespace: string,
  methodName: string,
) {
  const debounceCache = new Map<string, Function>();
  const throttleCache = new Map<string, Function>();

  return function (payload, meta?: Meta) {
    const type = `${namespace}/${methodName}`;
    const dispatchFn = () =>
      reduxStore.dispatch({
        type: `${namespace}/${methodName}`,
        payload,
      });
    if (meta?.debounce) {
      if (debounceCache.has(type)) {
        debounceCache.get(type)();
      } else {
        const debounceDispatchFn = debounce(dispatchFn, meta.debounce);
        debounceCache.set(type, debounceDispatchFn);
        debounceDispatchFn();
      }
    } else if (meta?.throttle) {
      if (throttleCache.has(type)) {
        throttleCache.get(type)();
      } else {
        const throttleDispatchFn = throttle(dispatchFn, meta.throttle);
        throttleCache.set(type, throttleDispatchFn);
        throttleDispatchFn();
      }
    } else {
      dispatchFn();
    }
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
