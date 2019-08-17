import { ModelMap, Model } from "@dura/types";
import {keys,merge,cloneDeep} from "lodash";
import { delay } from "./util";

export default function getAsyncMiddleware(rootModel: ModelMap) {
  const rootEffects = keys(rootModel)
    .map((name: string) => extractEffects(name, rootModel[name]))
    .reduce(merge, {});
  return store => next => async action => {
    let result = next(action);
    if (typeof rootEffects[action.type] === "function") {
      const dispatch = store.dispatch;
      const getState = () => cloneDeep(store.getState());
      const select = (_select: (state) => any) => _select(getState());
      //执行effect
      const effect = rootEffects[action.type];
      await effect(
        {
          dispatch,
          select,
          delay
        },
        action
      );
    }
    return result;
  };
}

/**
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model<any>) {
  const { effects } = model;
  return keys(effects)
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce(merge, {});
}
