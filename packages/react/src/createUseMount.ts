import { useRef, useEffect } from 'react';
import { Store, combineReducers } from 'redux';
import { produceWithPatches, enablePatches, setAutoFreeze } from 'immer';
import { DURA_SYMBOL } from './symbol';
import { Action, GlobalStorage, SliceStorage } from './@types';
import {
  UPDATE_LOADING_REDUCER_NAME,
  STATE_LOADING_MAPPING_KEY,
  ACTION_TYPE_SEP,
} from './createNamed';

enablePatches();
setAutoFreeze(false);

function updateLoadingReducer(
  state,
  action: Action<{ key: string; val: boolean }>,
) {
  state[STATE_LOADING_MAPPING_KEY][action.payload.key] = action.payload.val;
}

export function createUseMount<S>(
  name: string,
  initialState: S,
  store: Store,
  sliceStorage: SliceStorage,
  global: GlobalStorage,
) {
  return function useMount() {
    // 更新loading 状态的 reducer
    sliceStorage.reducers[UPDATE_LOADING_REDUCER_NAME] = updateLoadingReducer;

    // 初始化loading 的key
    const LOADING_MAPPING = Object.keys(sliceStorage.effects)
      .map((x) => ({ [x]: false }))
      .reduce((prev, next) => ({ ...prev, ...next }));

    const tagRef = useRef(true);

    if (tagRef.current && !global.reducers[name]) {
      global.effects[name] = sliceStorage.effects;
      global.reducers[name] = function (
        state = {
          ...initialState,
          [STATE_LOADING_MAPPING_KEY]: LOADING_MAPPING,
        },
        action: Action,
      ) {
        const [, reducerName] = action.type.split(ACTION_TYPE_SEP);
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
