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

function useComponent<S extends PlainObject, T extends PlainObject>(
  context: Context<S>,
  Component: ReactComponent<T>,
) {
  const storeState = useContext(context);
  const deps = useRef<Map<string, number>>(new Map<string, number>());
  const storeStateProxy = createProxy(storeState, deps.current);
  const pureCompared = useMemo(() => getPureCompared(deps.current), [deps]);
  const MemoComponent = useMemo(() => memo(Component, pureCompared), [deps]);
  return { MemoComponent, storeStateProxy };
}

export function createDefineComponent<CS>(
  context: Context<CS>,
): <P>(Component: ReactComponent<P>) => FC<P>;

export function createDefineComponent(context) {
  return function defineComponent(Component) {
    return function duraComponent(ownProps) {
      const { MemoComponent, storeStateProxy } = useComponent(
        context,
        Component,
      );
      return <MemoComponent {...ownProps} store={storeStateProxy} />;
    };
  };
}

function useContainer(reduxStore) {
  const [storeState, setStoreState] = useState(reduxStore.getState());
  useEffect(
    () => reduxStore.subscribe(() => setStoreState(reduxStore.getState())),
    [],
  );
  return { storeState };
}

export function createDefineContainer(context, reduxStore) {
  return function defineContainer(Component) {
    return function duraContainer(ownProps) {
      const { Provider } = context;
      const { storeState } = useContainer(reduxStore);
      const { MemoComponent, storeStateProxy } = useComponent(
        context,
        Component,
      );
      return (
        <Provider value={storeState}>
          <MemoComponent {...ownProps} store={storeStateProxy} />
        </Provider>
      );
    };
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
    if (patches.length > 0) {
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
