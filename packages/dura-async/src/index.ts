import { RootModel, Model, Plugin, Pack, ExcludeTypeAction, Store } from "@dura/types";
import { createAction } from "redux-actions";
import clone from "clone";
import _ from "lodash";
/**
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model<any> & AsyncModel) {
  const { effects = {} } = model;
  return _.keys(effects)
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce(_.merge, {});
}

//创建单个model 的action runner
function createModelEffectRunner(name: string, model: Model<any> & AsyncModel) {
  const { effects = {} } = model;
  return {
    [name]: _.keys(effects)
      .map((effectKey: string) => ({
        [effectKey]: createAction(`${name}/${effectKey}`, payload => payload, (payload, meta) => meta)
      }))
      .reduce(_.merge, {})
  };
}

//创建全局的action  runner
function createEffectRunner(models: RootModel) {
  return _.keys(models)
    .map((name: string) => createModelEffectRunner(name, models[name]))
    .reduce(_.merge, {});
}

export const createAsyncPlugin = function(): Plugin {
  return {
    name: "asyncPlugin",
    onCreateMiddleware(rootModel: RootModel) {
      //聚合effects
      const rootEffects = Object.keys(rootModel)
        .map((name: string) => extractEffects(name, rootModel[name]))
        .reduce((prev, next) => ({ ...prev, ...next }), {});
      const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));
      return store => next => async action => {
        let result = next(action);
        if (typeof rootEffects[action.type] === "function") {
          const dispatch = store.dispatch;
          const getState = () => clone(store.getState());
          const select = (_select: (state: any) => any) => _select(getState());
          //执行effect
          const effect = rootEffects[action.type];
          result = await effect(action, {
            dispatch,
            select,
            delay
          });
        }
        return result;
      };
    },
    extraActions<RM extends RootModel>(rootModel: RM): ExtractEffectsRunner<RM> {
      return createEffectRunner(rootModel);
    }
  };
};

export type AsyncModel = {
  effects?: {
    [name: string]: (action: ExcludeTypeAction, effectApi: EffectAPI) => void;
  };
};

export type ExtractEffectsRunner<M extends RootModel> = {
  [key in keyof M]: "effects" extends keyof M[key] ? ReviewEffects<M[key]["effects"]> : never
};

export type Effect = (action: ExcludeTypeAction, request: EffectAPI) => void;

export type ReviewEffects<E extends EffectMap> = { [key in keyof E]: Pack<Parameters<E[key]>[0]> };

export type EffectMap = {
  [name: string]: Effect;
};

export type EffectAPI = {
  dispatch: any;
  delay: (ms: number) => Promise<{}>;
  select: (fn: (state) => any) => any;
};
