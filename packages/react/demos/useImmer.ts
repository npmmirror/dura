import produce, { Draft } from 'immer';
import { useState, useCallback } from 'react';
import { usePersistFn } from 'ahooks';

export function useImmer<S = any>(
  initialValue: S | (() => S),
): [S, (f: (draft: Draft<S>) => void | S) => void];

export function useImmer(initialValue: any) {
  const [val, updateValue] = useState(initialValue);
  return [
    val,
    usePersistFn((updater: any) => {
      updateValue(produce(updater));
    }, []),
  ];
}
