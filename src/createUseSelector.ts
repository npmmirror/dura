import { useEffect, useRef } from 'react';
import { Store } from 'redux';
import { get } from 'lodash-es';
import { useUpdate } from '@onecocjs/use';

export function createUseSelector(namespace: string, store: Store) {
  return function useSelector(selector: Function) {
    const update = useUpdate();
    const refCache = useRef(undefined);
    refCache.current = selector(store.getState()[namespace]);

    useEffect(
      () =>
        store.subscribe(() => {
          const _ = selector(store.getState()[namespace]);
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
      [store.subscribe, namespace],
    );

    return selector(store.getState()[namespace]);
  };
}
