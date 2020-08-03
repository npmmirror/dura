import { Middleware } from 'redux';
export function createEffectMiddleware<T extends Function>(
  loadEffects: T,
): Middleware {
  return (store) => (next) => (action) => {
    const [namespace, methodName] = action.type.split('/');
    const effect = loadEffects(namespace, methodName);
    if (effect) {
      const getState = () =>
        process.env.NODE_ENV === 'production'
          ? store.getState()
          : Object.freeze(store.getState());
      effect(getState);
    }
    return next(action);
  };
}
