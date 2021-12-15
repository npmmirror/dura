import { Api, ConfigureOptions, StoreEnhancerExt, StoreManager } from './types';
import {
  ReducersMapObject,
  StoreEnhancer,
  combineReducers,
  compose,
} from 'redux';
import { __COMMIT__ } from './internal/const';
import { createConnect } from './plugins/createConnect';
import { createDefineFire } from './plugins/createDefineFire';
import { createImmerReducer } from './createImmerReducer';
import { createUseMount } from './plugins/createUseMount';
import { createUseSetState } from './plugins/createUseSetState';
import { createUseState } from './plugins/createUseState';
import { produceWithPatches } from 'immer';
import ts from 'ts-toolbelt';

export function configure(
  configureOptions: ConfigureOptions,
): StoreEnhancer<StoreEnhancerExt> {
  const GLOBAL_REDUCERS: ReducersMapObject = { __AK__: () => ({}) };
  let isRefreshing = false;
  return (next) => (reducer, initialState) => {
    const reduxStore = next(reducer, initialState);
    return {
      ...reduxStore,
      createAk(akOptions) {
        const { namespace } = akOptions;

        const immerReducer = createImmerReducer(akOptions);

        const has = () => !!GLOBAL_REDUCERS[namespace];

        const del = () => void delete GLOBAL_REDUCERS[namespace];

        const add = () => void (GLOBAL_REDUCERS[namespace] = immerReducer);

        const refresh = () => {
          isRefreshing = true;
          reduxStore.replaceReducer(
            compose(reducer, combineReducers(GLOBAL_REDUCERS)),
          );
          isRefreshing = false;
        };

        const getState = () => {
          const currentState = reduxStore.getState()[namespace];
          if (!currentState) {
            throw new Error('State is not mounted');
          }
          return currentState;
        };

        const getCommitType = (funcName: string) =>
          [namespace, `${__COMMIT__}${funcName || 'Anonymous'}`].join('/');

        const setState = (fn: ts.F.Function) => {
          const state = getState();
          if (state) {
            const [, patches] = produceWithPatches((draft) => {
              fn(draft);
            })(state);
            const action = {
              type: getCommitType(fn.name),
              payload: {
                patches,
              },
            };
            reduxStore.dispatch(action as never);
          }
        };

        const storeManager = ({
          has,
          del,
          add,
          refresh,
          reduxStore,
        } as unknown) as StoreManager;

        const api: Api = {
          configureOptions,
          isRefreshing: () => isRefreshing,
          setState,
          getState,
          akOptions,
          storeManager,
        };

        const useMount = createUseMount(api);
        const useState = createUseState(api);
        const useSetState = createUseSetState(api);
        const connect = createConnect(api);
        const defineFire = createDefineFire(api);

        return {
          useMount,
          useState,
          useSetState,
          UNSAFE_setState: setState,
          UNSAFE_getState: getState,
          connect,
          defineFire,
        } as never;
      },
    };
  };
}
