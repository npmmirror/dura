import { Api } from '../types';
import { __PATCHES__ } from '../internal/const';
import { createProxy } from '../internal/createProxy';
import { shallowEqual } from '../internal/shallowEqual';
import { useEffect, useRef } from 'react';
import { useMemoized } from '../internal/useMemoized';
import { useRender } from '../internal/useRender';
import ts from 'ts-toolbelt';

/**
 * 依赖收集的逻辑
 */
function useAutoSubscribe(api: Api) {
  const {
    akOptions: { namespace },
    storeManager: { reduxStore },
  } = api;

  const render = useRender();
  // immer proxy of state
  const refStateProxy = useRef(undefined);
  // deps
  const refDeps = useMemoized(() => new Map<string, number>());

  function recording() {
    //获取当前节点的 redux 数据
    const state = reduxStore.getState()?.[namespace];
    //清空过时的依赖缓存
    refDeps.clear();
    //创建 proxy 代理对象
    refStateProxy.current = createProxy(state, refDeps);
  }

  setTimeout(() => {
    console.log(Array.from(refDeps));
  }, 200);

  const subscribe = () => {
    const currentState = reduxStore.getState()[namespace];

    const isUpdate = currentState[__PATCHES__].some((x) => refDeps.has(x));

    isUpdate && render();
  };

  return { recording, subscribe, state: () => refStateProxy.current };
}

function useForceRenderSubscribe(api: Api, selector?: ts.F.Function) {
  const render = useRender();
  const currentState = useRef<ts.O.Object>();

  function recording() {
    if (selector) {
      currentState.current = selector(api.getState());
    } else {
      currentState.current = api.getState();
    }
  }

  function subscribe() {
    if (!api.isRefreshing()) {
      if (selector) {
        const nextState = api.getState();

        if (!shallowEqual(selector(nextState), currentState.current)) {
          render();
        }
      } else {
        render();
      }
    }
  }

  return { recording, subscribe, state: () => currentState.current };
}

export function createUseState(api: Api) {
  const {
    storeManager: { reduxStore },
  } = api;
  /**
   * 三种模式
   * 1. 依赖收集
   * 2. 疯狂渲染 crazy
   * 3. mapState
   */
  return function useState(selector?: ts.F.Function) {
    // const render = useRender();
    // const curr = useRef(api.getState());
    // curr.current = api.getState();
    // useEffect(() =>
    //   reduxStore.subscribe(() => {
    //     render();
    //   })
    // );
    // return curr.current;

    const { subscribe, state, recording } = useForceRenderSubscribe(
      api,
      selector,
    );

    /** 记录 */
    recording();

    // const deps = [reduxStore.subscribe, subscribe];

    useEffect(() => reduxStore.subscribe(subscribe), [subscribe]);

    return state();
  };
}
