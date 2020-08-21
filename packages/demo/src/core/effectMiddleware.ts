import { Middleware, Store, Dispatch, Action } from 'redux';
import isPlainObject from 'lodash.isplainobject';
export function createEffectMiddleware<T extends Function>(
  loadEffects: T,
): Middleware {
  return (store: Store) => (next: Dispatch) => (action: Action) => {
    const [namespace, methodName] = action.type.split('/');
    const effect = loadEffects(namespace, methodName);
    if (effect) {
      const getState = () => getStateProxy(store);
      effect(getState);
    }
    return next(action);
  };
}

function getStateProxy(store: Store) {
  const state = store.getState();
  if (process.env.NODE_ENV === 'production') {
    return state;
  }
  // 非生产环境下，会自动对全量的state进行冻结操作
  return freezeOfProxy(state);
}

function freezeOfProxy<S extends object>(state: S) {
  return new Proxy(state, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      //如果不是我自身定义的属性
      if (!target.hasOwnProperty(property)) {
        return value;
      }
      if (isPlainObject(value) || Array.isArray(value)) {
        return freezeOfProxy(Object.freeze(value));
      }
      return value;
    },
  });
}
