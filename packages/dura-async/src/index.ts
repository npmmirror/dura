import { RootModel, Model } from "@dura/types";

/**
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model) {
  const effects = model.effects || {};
  const effectKeys = Object.keys(effects);
  const nextEffects = effectKeys
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return nextEffects;
}

export const createAsyncPlugin = function(rootModel: RootModel) {
  //聚合effects
  const rootEffects = Object.keys(rootModel)
    .map((name: string) => extractEffects(name, rootModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));
  return {
    name: "asyncPlugin",
    middleware(store) {
      return next => async action => {
        let result = next(action);
        if (typeof rootEffects[action.type] === "function") {
          const dispatch = store.dispatch;
          const getState = () => store.getState();
          //执行effect
          const effect = rootEffects[action.type](action.payload, action.meta);
          result = await effect({
            dispatch,
            getState,
            delay
          });
        }
        return result;
      };
    }
  };
};
