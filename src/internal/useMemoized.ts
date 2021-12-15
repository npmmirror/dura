import { useRef } from 'react';

export function useMemoized<T>(factory: () => T, deps: unknown[] = []) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  if (current.initialized === false || !depsShallowEqual(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}

function depsShallowEqual(prevDeps: unknown[], currDeps: unknown[]) {
  for (let index = 0; index < currDeps.length; index++) {
    const prev = prevDeps[index];
    const curr = currDeps[index];
    if (prev === curr) {
      continue;
    }
    return false;
  }

  return true;
}
