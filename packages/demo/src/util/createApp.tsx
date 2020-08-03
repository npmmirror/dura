import { createContext } from 'react';
import {
  Middleware,
  StoreEnhancer,
  createStore,
  combineReducers,
  Store as ReduxStore,
  applyMiddleware,
} from 'redux';
import { produceWithPatches } from 'immer';
import { PATCHES_SYMBOL } from './Symbol';
import { defineHiddenProperty } from './defineHiddenProperty';
import { createEffectMiddleware } from './effectMiddleware';
import {
  createDefineComponent,
  createDefineContainer,
} from './createDefineComponent';

type Reducers<S> = {
  [name: string]: (state: S, action: any) => void;
};

type Store<S> = {
  namespace: string;
  state: {
    [name: string]: any;
  };
  reducers: Reducers<S>;
  effects: {};
};

function getDefineComponentFn<R extends ReduxStore>(reduxStore: R) {
  const context = createContext(reduxStore.getState());
  return {
    defineContainer: createDefineContainer(context, reduxStore),
    defineComponent: createDefineComponent(reduxStore),
  };
}

export function createAppCreator(
  middlewares: Middleware[] = [],
  enhancers: StoreEnhancer[] = [],
) {
  return function createApp() {
    let reducers: any = {};
    let effects: any = {};
    let reduxStore: ReduxStore;
    const app = {
      use: (...store: Store<any>[]) => {
        store.forEach((n) => {
          if (n.namespace in reducers) {
            console.error('xxx');
          } else {
            reducers[n.namespace] = (state = n.state, action: any) => {
              const [nextState, patches] = produceWithPatches((draft) =>
                n.reducers[action.type.split('/')[1]]?.(draft, action),
              )(state);
              let p: any = {};
              patches.forEach((k) => {
                p[[n.namespace, ...k.path].join('.')] = '';
              });
              const s = patches.map((k) => [n.namespace, ...k.path].join('.'));
              defineHiddenProperty(nextState, PATCHES_SYMBOL, s);

              return nextState;
            };

            effects[n.namespace] = n.effects;
          }
        });
        reduxStore && reduxStore.replaceReducer(combineReducers(reducers));
      },
      unUse: (namespace: string) => {
        delete effects[namespace];
        delete reducers[namespace];
        reduxStore.replaceReducer(combineReducers(reducers));
      },
      run: () => {
        const loadEffects = (namespace: string, methodName: string) =>
          effects[namespace][methodName];
        const effectMiddleware = createEffectMiddleware(loadEffects);

        const enhancer = enhancers.reduce(
          (chain, next) => next(chain),
          applyMiddleware(effectMiddleware, ...middlewares),
        );

        reduxStore = createStore(combineReducers(reducers), enhancer);
        return { store: reduxStore, ...getDefineComponentFn(reduxStore) };
      },
    };
    return app;
  };
}
