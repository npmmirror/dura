import React, {
  useState,
  useEffect,
  createContext,
  useRef,
  useMemo,
} from "react";
import {
  Middleware,
  StoreEnhancer,
  createStore,
  combineReducers,
  Store as ReduxStore,
  applyMiddleware,
} from "redux";
import { get, uniqWith, isEqual, uniq, chain, isFunction, times } from "lodash";
import { produce, produceWithPatches } from "immer";
import { createProxy } from "./createProxy";

function createThunk(getEffects: any): Middleware {
  return (store) => (next) => (action) => {
    const [namespace, methodName] = action.type.split("/");

    getEffects?.()?.[namespace]?.[methodName]?.(
      Object.freeze(store.getState())
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
    Component: React.ClassicComponentClass | React.FC
  ) => {
    return () => {
      const [store, setStore] = useState(reduxStore.getState());
      useEffect(
        () => reduxStore.subscribe(() => setStore(reduxStore.getState())),
        []
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
      | React.FC<{ store: any }>
  ) => {
    return (ownProps: any) => {
      const props = React.useContext(context);
      const deps = useRef<Map<string, null>>(new Map());

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
              if (keysA[i] === "store") {
                continue;
              }
              if (
                !hasOwn.call(nextProps, keysA[i]) ||
                prevProps[keysA[i]] !== nextProps[keysA[i]]
              ) {
                return false;
              }
            }

            const values = Object.values(nextProps.store);

            let flag = false;
            for (let index = 0; index < values.length; index++) {
              const value: any = values[index];
              if (value.patches.length <= 0) {
                if (index === values.length - 1 && !flag) {
                  return true;
                }
                continue;
              }
              flag = true;

              const s = value.patches.some((n: string) => {
                // return deps.current.some((k: any) => {
                //   return n === k
                // })

                return deps.current.has(n);
              });

              if (!s) {
                return true;
              }
            }

            // if (Object.keys(prevProps) !== Object.keys(nextProps)) {
            //   return false
            // }
            // console.log("http://localhost:3030/");
            console.log(prevProps, nextProps);

            return false;

            // const r = Object.values(nextProps.store)
            // .filter(n => n.patches.length > 0).map(n => {

            //   return n.patches
            // }).reduce( (prev,next) => ([...prev,...next]),[] )

            // console.time("res")
            // const res = !r.some((n: any) => {

            //   return deps.current.some((k: any) => {

            //     return n === k
            //   }
            // )})
            // console.timeEnd("res")

            // return res
          }),
        []
      );
      // console.log(ownProps);

      return <MemoComponent store={proxy} {...ownProps} />;
    };
  };

  return { defineContainer, defineComponent };
}

export function createAppCreator(
  middlewares: Middleware[] = [],
  enhancers: StoreEnhancer[] = []
) {
  return function createApp() {
    let reducers: any = {};
    let effects: any = {};
    let reduxStore: ReduxStore;
    const app = {
      use: (...store: Store<any>[]) => {
        store.forEach((n) => {
          if (n.namespace in reducers) {
            console.error("xxx");
          } else {
            reducers[n.namespace] = (state = n.state, action: any) => {
              const [res, patches] = produceWithPatches((draft) =>
                n.reducers[action.type.split("/")[1]]?.(draft, action)
              )(state);

              let p: any = {};

              patches.forEach((k) => {
                p[[n.namespace, ...k.path].join(".")] = "";
              });
              const s = patches.map((k) => [n.namespace, ...k.path].join("."));

              return { ...res, patches: s };
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
        reduxStore = createStore(
          combineReducers(reducers),
          applyMiddleware(createThunk(() => effects))
        );
        return { store: reduxStore, ...getDefineComponentFn(reduxStore) };
      },
    };
    return app;
  };
}
