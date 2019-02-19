import { RootModel, Model, Plugin, DuraStore, Payload, Meta, Dispatch, Pack } from "@dura/types";
import { createAction } from "redux-actions";
import clone from "clone";

/**
 * 提取effects
 * @param name
 * @param model
 */
function extractEffects(name: string, model: Model & AsyncModel) {
  const effects = model.effects || {};
  const effectKeys = Object.keys(effects);
  const nextEffects = effectKeys
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return nextEffects;
}

//创建单个model 的action runner
function createModelEffectRunner(name: string, model: Model & AsyncModel, dispatch: Dispatch) {
  const { effects = {} } = model;
  const effectKeys = Object.keys(effects);
  const merge = (prev, next) => ({ ...prev, ...next });

  const createActionMap = (key: string) => ({
    [key]: (payload: any, meta: any) =>
      dispatch(createAction(`${name}/${key}`, payload => payload, (payload, meta) => meta)(payload, meta))
  });

  const action = effectKeys.map(createActionMap).reduce(merge, {});
  return { [name]: action };
}

//创建全局的action  runner
function createEffectRunner(models: RootModel, dispatch: Dispatch) {
  const merge = (prev, next) => ({ ...prev, ...next });
  return Object.keys(models)
    .map((name: string) => createModelEffectRunner(name, models[name], dispatch))
    .reduce(merge, {});
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
          result = await effect(action,{
            dispatch,
            getState,
            select,
            delay
          });
        }
        return result;
      };
    },
    onStoreCreated(store: DuraStore & AsyncDuraStore, rootModel: RootModel) {
      store.effectRunner = createEffectRunner(rootModel, store.dispatch);
    }
  };
};

export type AsyncModel = {
  effects?: {
    [name: string]: any;
  };
};

export type ExtractEffectsRunner<M extends RootModel<Model & AsyncModel>> = {
  [key in keyof M]: ReviewEffects<M[key]["effects"]>
};

export type AsyncDuraStore<M extends RootModel = any> = {
  effectRunner: ExtractEffectsRunner<M>;
};

export type Effect = (request: EffectAPI) => void;

export type ReviewEffects<E extends Effects> = { [key in keyof E]: Pack<Parameters<E[key]>[0]> };

export type Effects = {
  [name: string]: (payload?: Payload, meta?: Meta) => Effect;
};

export type EffectAPI = {
  dispatch: any;
  delay: (ms: number) => Promise<{}>;
  select: (fn: (state) => any) => any;
};
