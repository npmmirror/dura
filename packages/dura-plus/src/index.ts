import { create as _create } from "@dura/core";
import {merge,cloneDeep,values,entries} from "lodash";
import {
  Config,
  ExcludeTypeAction,
  Reducer,
  Effect,
  Store,
  onReducer,
  PluginMap,
  ModelMap,
  UnionToIntersection
} from "@dura/types";

function recursiveOnReducer(
  modelName: string,
  reducerName: string,
  reducer: Reducer<any, ExcludeTypeAction>,
  onReducerList: onReducer[]
): Reducer<any, ExcludeTypeAction> {
  if (onReducerList && onReducerList.length === 0) {
    return reducer;
  }
  const nextReducer = onReducerList.shift()(modelName, reducerName, reducer);
  return recursiveOnReducer(modelName, reducerName, nextReducer, onReducerList);
}

function recursiveOnEffect(modelName: string, effectName: string, effect: Effect, onEffectList: onReducer[]): Effect {
  if (onEffectList && onEffectList.length === 0) {
    return effect;
  }
  const nextEffect = onEffectList.shift()(modelName, effectName, effect);
  return recursiveOnEffect(modelName, effectName, nextEffect, onEffectList);
}

const create = function<C extends Config, P extends PluginMap>(
  config: C,
  pluginMap?: P
): Store<C["initialModel"] & UnionToIntersection<P[keyof P]["extraModel"]>> {
  //clone
  const { initialModel, initialState, middlewares, extraReducers } = cloneDeep(config);

  const onReducerList = values(pluginMap)
    .filter(plugin => plugin.onReducer)
    .map(plugin => plugin.onReducer);

  const onEffectList = values(pluginMap)
    .filter(plugin => plugin.onEffect)
    .map(plugin => plugin.onEffect);

  const extraModelMap: ModelMap = values(pluginMap)
    .filter(plugin => plugin.extraModel)
    .map(plugin => plugin.extraModel)
    .reduce(merge, {});

  const initialModelMap = entries(merge(initialModel, extraModelMap))
    .map(([modelName, model]) => {
      const reducers = entries(model.reducers)
        .map(([reducerName, reducer]) => ({
          [reducerName]: recursiveOnReducer(modelName, reducerName, reducer, cloneDeep(onReducerList))
        }))
        .reduce(merge, {});

      const effects = entries(model.effects)
        .map(([effectName, effects]) => ({
          [effectName]: recursiveOnEffect(modelName, effectName, effects, cloneDeep(onEffectList))
        }))
        .reduce(merge, {});
      return {
        [modelName]: {
          ...model,
          reducers,
          effects
        }
      };
    })
    .reduce(merge, {});

  return _create({
    initialModel: initialModelMap,
    initialState: initialState,
    middlewares: middlewares,
    compose: config.compose,
    createStore: config.createStore,
    extraReducers: config.extraReducers
  }) as Store<C["initialModel"] & UnionToIntersection<P[keyof P]["extraModel"]>>;
};

export { create };

export * from "@dura/types";
