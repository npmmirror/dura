import { useRef, useLayoutEffect } from 'react';

export type Operator = {
  has: () => boolean;
  del: () => void;
  add: () => void;
  refresh: () => void;
};

export function createUseMount({ has, del, add, refresh }: Operator) {
  return function useMount() {
    const ref = useRef<(() => void) | undefined>(undefined);

    ref.current = () => has() && void (del(), refresh());

    !has() && (add(), refresh());

    useLayoutEffect(() => ref.current, [ref]);
  };
}
