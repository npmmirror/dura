import { useRef, useEffect } from 'react';
import { Store, combineReducers } from 'redux';
import { produceWithPatches, enablePatches, setAutoFreeze } from 'immer';
import { DURA_SYMBOL } from './symbol';
import { Action, GlobalStorage, SliceStorage } from './@types';

enablePatches();
setAutoFreeze(false);

export function createUseMount<S>(
  name: string,
  initialState: S,
  store: Store,
  sliceStorage: SliceStorage,
  global: GlobalStorage,
) {
  return function useMount() {
    const tagRef = useRef(true);
    if (tagRef.current && !global.reducers[name]) {
      global.effects[name] = sliceStorage.effects;
      global.reducers[name] = function (state = initialState, action: Action) {
        const [, reducerName] = action.type.split('/');
        const [nextState, patches, inversePatches] = produceWithPatches(
          (draft: S) => {
            sliceStorage?.reducers?.[reducerName]?.(draft, action);
          },
        )(state);
        const stringPatches = patches.map(({ path }) => `${path.join('.')}`);
        Object.defineProperty(nextState, DURA_SYMBOL, {
          value: stringPatches,
          enumerable: false,
          configurable: true,
          writable: false,
        });
        return nextState;
      };
      store.replaceReducer(
        combineReducers({ ...global.reducers, ...global.coreReducers }),
      );
      tagRef.current = false;
    }
    useEffect(() => {
      global.refCount[name] = (global.refCount[name] ?? 0) + 1;
      return () => {
        --global.refCount[name];
        if (global.refCount[name] === 0) {
          delete global.effects[name];
          delete global.reducers[name];
          store.replaceReducer(
            combineReducers({ ...global.reducers, ...global.coreReducers }),
          );
        }
      };
    }, []);
  };
}
