import React, { useState, useEffect, createContext, useRef } from 'react';
import {
  Middleware,
  StoreEnhancer,
  createStore,
  combineReducers,
  Store as ReduxStore,
  applyMiddleware,
  compose,
} from 'redux';
import { produceWithPatches } from 'immer';
import { createProxy } from './createProxy';
import { DURA_SYMBOL, PATCHES_SYMBOL } from './Symbol';

function createThunk(getEffects: any): Middleware {
  return (store) => (next) => (action) => {
    const [namespace, methodName] = action.type.split('/');

    getEffects?.()?.[namespace]?.[methodName]?.(
      Object.freeze(store.getState()),
    );

    return next(action);
  };
}

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

function getDefineComponentFn(reduxStore: ReduxStore) {
  const context = createContext(reduxStore.getState());

  const { Provider, Consumer } = context;

  const defineContainer = (
    Component: React.ClassicComponentClass | React.FC,
  ) => {
    return () => {
      const [store, setStore] = useState(reduxStore.getState());
      useEffect(
        () => reduxStore.subscribe(() => setStore(reduxStore.getState())),
        [],
      );
      return (
        <Provider value={store}>
          <Component />
        </Provider>
      );
    };
  };

  const defineComponent = (
    Component:
      | React.ClassicComponentClass<{ store: any }>
      | React.FC<{ store: any }>,
  ) => {
    return (ownProps: any) => {
      const props = React.useContext(context);
      const deps = useRef<Map<string, number>>(new Map());

      const proxy = createProxy(props, deps.current);
      const MemoComponent = React.useMemo(
        () =>
          React.memo(Component, (prevProps, nextProps) => {
            const keysA = Object.keys(prevProps);
            const keysB = Object.keys(nextProps);

            if (keysA.length !== keysB.length) {
              return false;
            }

            const hasOwn = Object.prototype.hasOwnProperty;
            for (let i = 0; i < keysA.length; i++) {
              if (keysA[i] === 'store') {
                continue;
              }

              if (
                !hasOwn.call(nextProps, keysA[i]) ||
                prevProps[keysA[i]][DURA_SYMBOL] !==
                  nextProps[keysA[i]][DURA_SYMBOL]
              ) {
                return false;
              }
            }

            const values = Object.values(nextProps.store);

            let flag = false;
            for (let index = 0; index < values.length; index++) {
              const value: any = values[index];
              if (value[PATCHES_SYMBOL].length <= 0) {
                if (index === values.length - 1 && !flag) {
                  return true;
                }
                continue;
              }
              flag = true;

              const s = value[PATCHES_SYMBOL].some((n: string) => {
                return deps.current.has(n);
              });

              if (!s) {
                return true;
              }
            }
            deps.current.clear();
            return false;
          }),
        [],
      );

      return <MemoComponent store={proxy} {...ownProps} />;
    };
  };

  return { defineContainer, defineComponent };
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
              const [res, patches] = produceWithPatches((draft) =>
                n.reducers[action.type.split('/')[1]]?.(draft, action),
              )(state);
              let p: any = {};
              patches.forEach((k) => {
                p[[n.namespace, ...k.path].join('.')] = '';
              });
              const s = patches.map((k) => [n.namespace, ...k.path].join('.'));
              Object.defineProperty(res, PATCHES_SYMBOL, {
                value: s,
                writable: true,
              });
              return res;
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
        const composeEnhancers =
          typeof window === 'object' &&
          window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                name: 'dura4.x-draft',
                trace: true,
              })
            : compose;

        const enhancer = composeEnhancers(
          applyMiddleware(createThunk(() => effects)),
          // other store enhancers if any
        );
        reduxStore = createStore(combineReducers(reducers), enhancer);
        return { store: reduxStore, ...getDefineComponentFn(reduxStore) };
      },
    };
    return app;
  };
}
