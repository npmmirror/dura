import { useRef, useEffect } from 'react';
import { get } from 'lodash-es';
import { useUpdate, useMemoized, usePersistFn } from '@onecocjs/use';
import { Context, Selector } from '../types';
import { createProxy } from '../createProxy';

/**
 * 依赖收集的逻辑
 */
function useAutoSubscribe({ namespace, reduxStore }: Context) {
  const update = useUpdate();
  // immer proxy of state
  const refStateProxy = useRef(undefined);
  // state
  const refState = useRef(undefined);
  // deps
  const refDeps = useMemoized(() => new Map<string, unknown>());

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

  const subscribe = () => {
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
  };

  return { recording, subscribe, state: () => refStateProxy.current };
}

/**
 * 包含两种模式
 * 如果 selector 是一个函数， 那么则采用 shallowEqual diff模式，
 * 否则 采用癫狂模式渲染， 理论上 如果 selector 不是一个函数，那么值一定为 true，
 * 这应当由外部逻辑控制
 */
function useSelectorSubscribe(
  { namespace, reduxStore }: Context,
  selector: Selector | boolean,
) {
  const update = useUpdate();
  // selector state
  const refSelectorState = useRef(undefined);
  function recording() {
    if (typeof selector === 'function') {
      refSelectorState.current = selector(reduxStore.getState()[namespace]);
    } else {
      refSelectorState.current = reduxStore.getState()[namespace];
    }
  }
  const subscribe = () => {
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
  };
  return { recording, subscribe, state: () => refSelectorState.current };
}

export function createUseState(context: Context) {
  return function useState(selector: Selector | boolean = true) {
    /**
     * 依赖收集的 Subscribe
     */
    const autoSubscribeContext = useAutoSubscribe(context);
    /**
     * selector 与 癫狂渲染的组合体
     * 当 selector 是一个 函数时， 那么则根据 selector 的返回值进行 shallowEqual diff，
     * 否则 状态的每一次变更都会导致渲染。
     */
    const selectorSubscribeContext = useSelectorSubscribe(context, selector);

    /**
     * 如果 selector 为 false ， 那么 有可能是 基于 selector 的 shallowEqual diff ，
     * 否则 是 癫狂渲染模式 ，这里需要保证，如果 selector 为 true ， 那么一定不可以走
     * useSelectorSubscribe
     */
    let { subscribe, state, recording } =
      selector === true ? autoSubscribeContext : selectorSubscribeContext;
    /** 记录 */
    recording();
    /**
     * 持久化的订阅函数，为了避免反复装卸 redux subscribe
     * 反复装卸增加计算量， 刻意的做持久化会增加内存开销。
     * 当然这部分的类比差异都是微乎其微的，所以暂时注释掉，优先尽可能的减少内存的开销
     * */
    // const subscribeFn = usePersistFn(subscribe);

    const deps = [context.reduxStore.subscribe, subscribe];

    useEffect(() => context.reduxStore.subscribe(subscribe), deps);

    return state();
  };
}
