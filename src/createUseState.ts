import { useRef, useEffect } from 'react';
import { Store } from 'redux';
import { get } from 'lodash-es';
import { useUpdate, useMemoized } from '@onecocjs/use';
import { createProxy } from './createProxy';

export function createUseState(namespace: string, store: Store) {
  return function useState(options: { selector: () => any }) {
    const update = useUpdate();
    //经过immer代理的对象
    const refProxy = useRef(undefined);
    //原始对象信息
    const refOri = useRef(undefined);
    //依赖信息
    const refDeps = useMemoized(() => new Map<string, unknown>());

    function recording() {
      //获取当前节点的 redux 数据
      const state = store.getState()?.[namespace];
      //清空过时的依赖缓存
      refDeps.clear();
      //每次都缓存一下最新的redux数据
      refOri.current = state;
      //创建 proxy 代理对象
      refProxy.current = createProxy(state, refDeps);
    }

    // TODO 这里注意一下，有可能需要 优化至 仅仅首次才 recording 一次
    recording();

    useEffect(
      () =>
        store.subscribe(() => {
          const _state = store.getState()[namespace];
          const keysIterator = refDeps.keys();
          let $ = keysIterator.next();
          let isUpdate = false;
          while (!$.done) {
            const path = $.value;
            if (get(_state, path) !== get(refOri.current, path)) {
              isUpdate = true;
              break;
            }
            $ = keysIterator.next();
          }

          if (isUpdate) {
            recording(), update();
          }
        }),
      [store.subscribe, namespace],
    );

    return refProxy.current;
  };
}
