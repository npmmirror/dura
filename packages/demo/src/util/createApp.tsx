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
import { get, uniqWith, isEqual, uniq, chain } from "lodash";
import { produce, produceWithPatches } from "immer";

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
  methods: {};
};

function getDefineComponentFn(reduxStore: ReduxStore) {
  const context = createContext(reduxStore.getState());

  const { Provider } = context;

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
    return () => {
      const props = React.useContext(context);
      const ref = useRef([]);
      const proxyProps = createProxy(props, ref.current);

      const MemoComponent = React.useMemo(() => {
        return React.memo(Component, (prevProps, nextProps) => {
          let memo = true;
          chain(ref.current)
            .map((n: string[]) => n.join("."))
            .uniq()
            .value()
            .forEach((path: string) => {
              if (get(prevProps.store, path) !== get(nextProps.store, path)) {
                memo = false;
              }
            });
          return memo;
        });
      }, []);
      return <MemoComponent store={proxyProps} />;
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
    let methods: any = {};
    const app = {
      use: (...store: Store<any>[]) => {
        store.forEach((n) => {
          if (n.namespace in reducers) {
            console.error("xxx");
          } else {
            reducers[n.namespace] = (state = n.state, action: any) => {
              const res = produce(state, (draft) =>
                n.reducers[action.type.split("/")[1]]?.(draft, action)
              );
              return res;
            };
            methods[n.namespace] = n.methods;
          }
        });
      },
      run: () => {
        const s: ReduxStore = createStore(
          combineReducers(reducers),
          applyMiddleware(createThunk(() => methods))
        );
        return { store: s, ...getDefineComponentFn(s) };
      },
    };
    return app;
  };
}

function prevElement(deps: string[][]) {
  return deps[deps.length - 1];
}

function nextDeps(property: string, deps: any) {
  if (deps?.length === 0 || typeof prevElement(deps) === "object") {
    const _deps = [property];
    deps.push(_deps);
    return _deps;
  }
  deps.push(property);
  return deps;
}

export function createProxy<T extends object>(state: T, deps: any): T {
  return new Proxy(state, {
    get(target: T, property: string, receiver: T) {
      if (property in target) {
        const _nextDeps = nextDeps(property, deps);
        const value = Reflect.get(target, property, receiver);
        if (value instanceof Object) {
          return createProxy({ ...value }, _nextDeps);
        }
        if (value instanceof Array) {
          return createProxy([...value], _nextDeps);
        }
      }
      return Reflect.get(target, property, receiver);
    },
  });
}
