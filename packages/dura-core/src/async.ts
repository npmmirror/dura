import { ModelMap, Model } from "@dura/types";
import _ from "lodash";
import { delay } from "./util";

export default function getAsyncMiddleware(rootModel: ModelMap) {
  const rootEffects = _.keys(rootModel)
    .map((name: string) => extractEffects(name, rootModel[name]))
    .reduce(_.merge, {});
  return store => next => async action => {
    let result = next(action);
    if (typeof rootEffects[action.type] === "function") {
      const dispatch = store.dispatch;
      const getState = () => _.cloneDeep(store.getState());
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
  return _.keys(effects)
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce(_.merge, {});
}
