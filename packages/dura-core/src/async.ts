import { ModelMap, Model } from "@dura/types";
import { delay } from "./util";

export default function getAsyncMiddleware(rootModel: ModelMap, error) {
  return store => next => action => {
    const [namespace, nameForEffect] = action.type.split("/");
    rootModel?.[namespace]
      ?.effects(store.dispatch, store.getState, delay)
      ?.[nameForEffect]?.(action?.payload, action?.meta)
      ?.catch(error);
    return next(action);
  };
}
