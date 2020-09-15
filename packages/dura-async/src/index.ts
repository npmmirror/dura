import type { Middleware } from "redux";
export interface GetEffects {
  (namespace: string, methodName: string): any;
}

export function createAsyncMiddleware(getEffects: GetEffects): Middleware {
  return (store) => (next) => (action) => {
    const [namespace, methodName] = action.type.split("/");
    const effect = getEffects(namespace, methodName);
    effect?.(action);
    return next(action);
  };
}
