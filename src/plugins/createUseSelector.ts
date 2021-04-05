import { useEffect, useRef } from 'react';
import { Action, AnyAction } from 'redux';
import { get } from 'lodash-es';
import { useUpdate } from '@onecocjs/use';
import { Context } from '../types';

export function createUseSelector<
  S extends Record<string, any>,
  A extends Action = AnyAction
>({ namespace, reduxStore }: Context<S, A>) {
  return function useSelector(selector: Function) {
    const update = useUpdate();
    const refCache = useRef(undefined);
    refCache.current = selector(reduxStore.getState()[namespace]);

    useEffect(
      () =>
        reduxStore.subscribe(() => {
          const _ = selector(reduxStore.getState()[namespace]);
          const keys = Object.keys(_);
          let isUpdate = false;
          for (let index = 0; index < keys.length; index++) {
            if (get(_, keys[index]) !== get(refCache.current, keys[index])) {
              isUpdate = true;
              break;
            }
          }
          if (isUpdate) {
            update();
          }
        }),
      [reduxStore.subscribe, namespace],
    );

    return selector(reduxStore.getState()[namespace]);
  };
}
