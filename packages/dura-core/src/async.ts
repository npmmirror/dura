import { delay } from "@dura/utils";

export default function getAsyncMiddleware(rootModel, error) {
  return (store) => (next) => (action) => {
    const [namespace, nameForEffect] = action.type.split("/");
    rootModel?.[namespace]
      ?.effects(store.dispatch, store.getState, delay)
      ?.[nameForEffect]?.(action?.payload, action?.meta)
      ?.catch(error);
    return next(action);
  };
}
