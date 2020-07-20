import {
  applyMiddleware,
  Middleware,
  createStore,
  StoreCreator,
  StoreEnhancer,
  PreloadedState,
  Reducer,
  compose,
} from "redux";
import React, { useContext } from "react";
import isPromise from "is-promise";
import { get, uniqWith, isEqual } from "lodash";

export function StoreCreatorFactory(
  middlewares: Middleware[] = [],
  enhancers: StoreEnhancer[] = []
) {
  function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => (next) => (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    };
  }
  return function creator<R>(
    reducers: Reducer<R>,
    preloadedState?: PreloadedState<R>
  ) {
    const store = createStore(
      reducers,
      preloadedState,
      compose(
        applyMiddleware(...middlewares, createThunkMiddleware()),
        ...enhancers
      )
    );

    const context = React.createContext(store.getState());
    context.displayName = "demo";

    return {
      store,
      defineContainer: (Component: React.ClassicComponentClass | React.FC) => {
        return () => {
          const [state, setState] = React.useState(store.getState());

          React.useEffect(() => {
            const unsubscribe = store.subscribe(() => {
              setState(store.getState());
            });
            () => unsubscribe?.();
          }, []);
          return (
            <context.Provider value={state}>
              <Component />
            </context.Provider>
          );
        };
      },
      defineComponent: (Component: React.ClassicComponentClass | React.FC) => {
        return () => {
          const props = React.useContext(context);
          // console.log(props);

          const r = React.useRef([]);

          const proxyProps = createProxy({ ...props }, r.current);
          // console.log(proxyProps["$"]);

          const MemoComponent = React.useMemo(() => {
            return React.memo(Component, (prevProps, nextProps) => {
              let memo = true;
              proxyProps["$"].forEach((p) => {
                if (
                  get(prevProps.getStore(), p) !== get(nextProps.getStore(), p)
                ) {
                  memo = false;
                }
              });

              return memo;
            });
          }, []);

          return <MemoComponent getStore={() => proxyProps} />;
        };
      },
    };
  };
}

interface Store<S, M> {
  namespace: string;
  state: {};
  reducers: {};
  effects: {};
}

export function defineStore<S, M>(store: Store<S, M>) {}

const createProxy = function (state, deps) {
  return new Proxy(state, {
    construct(target, args) {
      console.log("monster1 constructor called");
      // expected output: "monster1 constructor called"

      return new target(...args);
    },
    get(target, property, receiver) {
      function f() {
        if (deps.length === 0 || typeof deps[deps.length - 1] === "object") {
          const $ = [property];
          deps.push($);

          return $;
        }
        deps.push(property);

        return deps;
      }

      if (
        // typeof property === "string" &&
        property in target
        // && property !== "constructor"
      ) {
        const _ = f();
        if (typeof target[property] === "object") {
          return createProxy(target[property], _);
        }
      }
      if (property === "$") {
        return uniqWith(deps, isEqual);
      }

      // _.push('$$END');
      return target[property];
      // return Reflect.get(target, property, receiver);
    },
  });
};
