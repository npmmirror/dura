import React, {
  useContext,
  useRef,
  useMemo,
  memo,
  useEffect,
  useState,
} from 'react';
import type { Context, FC } from 'react';
import { createProxy } from './createProxy';
import { DURA_SYMBOL, PATCHES_SYMBOL } from './Symbol';

type Props<T> = { store: any };

type PlainObject = {
  [name: string]: any;
};

type ReactComponent<T> = React.ClassicComponentClass | React.FC<Props<T>>;

export function createDefineComponent<CS>(
  reduxStore: any,
): <P>(Component: ReactComponent<P>) => FC<P>;

export function createDefineComponent(reduxStore) {
  return function defineComponent(Component) {
    return memo(function DuraComponent(ownProps) {
      const deps = useRef<Map<string, number>>(new Map<string, number>());
      const storeRef = useRef(createProxy(reduxStore.getState(), deps.current));
      const [, setCount] = React.useState(0);
      React.useEffect(() => {
        return reduxStore.subscribe(() => {
          const nextStore = createProxy(reduxStore.getState(), deps.current);
          const memo = deepEqualProxyStore(nextStore, deps.current);
          if (!memo) {
            storeRef.current = nextStore;
            deps.current.clear();
            setCount(Math.random());
          }
        });
      }, []);
      return <Component {...ownProps} store={storeRef.current} />;
    }, shallowEqual);
  };
}

export function createDefineContainer(context, reduxStore) {
  return function defineContainer(Component) {
    return memo(function DuraContainer(ownProps) {
      const { Provider } = context;
      const deps = useRef<Map<string, number>>(new Map<string, number>());
      const storeRef = useRef(createProxy(reduxStore.getState(), deps.current));
      const storeRef1 = useRef(reduxStore.getState());
      const [, setCount] = React.useState(0);
      React.useEffect(() => {
        return reduxStore.subscribe(() => {
          let s = reduxStore.getState();
          const nextStore = createProxy(s, deps.current);
          const memo = deepEqualProxyStore(nextStore, deps.current);
          if (!memo) {
            storeRef.current = nextStore;
            storeRef1.current = s;
            deps.current.clear();
            setCount(Math.random());
          }
        });
      }, []);

      return (
        <Provider value={storeRef1.current}>
          <Component {...ownProps} store={storeRef.current} />;
        </Provider>
      );
    }, shallowEqual);
  };
}

function getPureCompared(deps: Map<string, number>) {
  return function pureCompared(prevProps: PlainObject, nextProps: PlainObject) {
    if (
      !shallowEqual(prevProps, nextProps) ||
      !deepEqualProxyStore(nextProps.store, deps)
    ) {
      deps.clear();
      return false;
    }
    return true;
  };
}

function deepEqualProxyStore<P, D extends Map<string, number>>(
  nextPropsStore: P,
  deps: D,
) {
  const values = Object.values(nextPropsStore);
  let index = -1;
  while (++index < values.length) {
    const patches = values[index][PATCHES_SYMBOL];
    if (patches?.length > 0) {
      const hasDependencies = patches.some((n: string) => deps.has(n));
      if (hasDependencies) {
        return false;
      }
    }
  }
  return true;
}

function shallowEqual<A extends PlainObject, B extends PlainObject>(
  prevProps: A,
  nextProps: B,
) {
  const filterStore = (key: string) => key !== 'store';
  const prevPropsKey = Object.keys(prevProps).filter(filterStore);
  const nextPropsKey = Object.keys(nextProps).filter(filterStore);
  if (prevPropsKey.length !== nextPropsKey.length) {
    return false;
  }
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  let index = -1;
  const len = prevPropsKey.length;
  while (++index < len) {
    const prevKey = prevPropsKey[index];
    const nextPropsHasOwnProperty = hasOwnProperty.call(nextProps, prevKey);
    const referenceEqual = prevProps[prevKey][DURA_SYMBOL]
      ? prevProps[prevKey][DURA_SYMBOL] === nextProps[prevKey][DURA_SYMBOL]
      : prevProps[prevKey] === nextProps[prevKey];
    if (!nextPropsHasOwnProperty || !referenceEqual) {
      return false;
    }
  }
  return true;
}
