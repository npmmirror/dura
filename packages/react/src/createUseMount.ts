import { useRef, useEffect } from 'react';
import { Store, ReducersMapObject, AnyAction, combineReducers } from 'redux';
import { produceWithPatches, enablePatches, setAutoFreeze } from 'immer';
import { DURA_SYMBOL } from './symbol';

enablePatches();
setAutoFreeze(false);
export function createUseMount<S>(
  name: string,
  initialState: S,
  store: Store,
  sliceReducers: SliceReducersMapObject,
  sliceSideEffects: any,
  globalReducers: ReducersMapObject,
  globalSideEffects: any,
  sliceRefCount: SliceRefCount,
) {
  return function useMount() {
    const tagRef = useRef(true);
    if (tagRef.current && !globalReducers[name]) {
      globalSideEffects[name] = sliceSideEffects;
      globalReducers[name] = function(state = initialState, action: AnyAction) {
        const [, reducerName] = action.type.split('/');
        const [nextState, patches, inversePatches] = produceWithPatches(
          (draft: S) => {
            sliceReducers?.[reducerName]?.(draft, action);
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
      store.replaceReducer(combineReducers(globalReducers));
      tagRef.current = true;
    }
    useEffect(
      () => () => {
        if (sliceRefCount[name] === 0) {
          delete globalSideEffects[name];
          delete globalReducers[name];
          store.replaceReducer(combineReducers(globalReducers));
        } else {
          sliceRefCount[name] = --sliceRefCount[name];
        }
      },
      [],
    );
  };
}
