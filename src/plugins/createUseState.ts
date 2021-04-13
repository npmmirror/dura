import { useRef, useEffect } from 'react';
import { get } from 'lodash-es';
import { useUpdate, useMemoized, usePersistFn } from '@onecocjs/use';
import { Context, Selector } from '../types';
import { createProxy } from '../createProxy';

export function createUseState({ namespace, reduxStore }: Context) {
  return function useState(selector: Selector | boolean = true) {
    // const selector = options?.selector;
    const update = useUpdate();
    // immer proxy of state
    const refStateProxy = useRef(undefined);
    // state
    const refState = useRef(undefined);
    // deps
    const refDeps = useMemoized(() => new Map<string, unknown>());
    // selector state
    const refSelectorState = useRef(undefined);

    // cache selector state
    if (typeof selector === 'function') {
      refSelectorState.current = selector?.(reduxStore.getState()[namespace]);
    }

    function recording() {
      //获取当前节点的 redux 数据
      const state = reduxStore.getState()?.[namespace];
      //清空过时的依赖缓存
      refDeps.clear();
      //每次都缓存一下最新的redux数据
      refState.current = state;
      //创建 proxy 代理对象
      refStateProxy.current = createProxy(state, refDeps);
    }

    // TODO 这里注意一下，有可能需要 优化至 仅仅首次才 recording 一次
    recording();

    const depAutoSubscribe = usePersistFn(() => {
      const currentState = reduxStore.getState()[namespace];
      const keysIterator = refDeps.keys();
      let current = keysIterator.next();
      let isUpdate = false;
      while (!current.done) {
        const thePath = current.value;

        if (get(currentState, thePath) !== get(refState.current, thePath)) {
          isUpdate = true;
          break;
        }
        current = keysIterator.next();
      }
      isUpdate && update();
    });

    const selectorSubscribe = usePersistFn(() => {
      if (typeof selector === 'function') {
        const currentState = reduxStore.getState()[namespace];
        const selectorState = selector!(currentState);
        const keys = Object.keys(selectorState);
        let isUpdate = false;
        for (let index = 0; index < keys.length; index++) {
          const theKey = keys[index];
          if (get(selectorState, theKey) !== get(refSelectorState, theKey)) {
            isUpdate = true;
            break;
          }
        }
        isUpdate && update();
      }
    });

    const subscribeState = usePersistFn(() => {
      if (selector === true) {
        depAutoSubscribe();
      } else if (typeof selector === 'function') {
        selectorSubscribe();
      } else {
        // if selector is false and other
        update();
      }
    });

    useEffect(() => reduxStore.subscribe(subscribeState), [subscribeState]);

    return refStateProxy.current;
  };
}
