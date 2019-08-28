import { create as _create } from '@dura/core';
import cloneDeep from 'lodash/cloneDeep';
import values from 'lodash/values';
import merge from 'lodash/merge';
import entries from 'lodash/entries';
import {
  Config,
  ExcludeTypeAction,
  Reducer,
  Effect,
  Store,
  onReducer,
  PluginMap,
  ModelMap,
  UnionToIntersection,
  onEffect
} from '@dura/types';

function recursiveWrapModel(name, model, wrapModelList) {
  if (wrapModelList && wrapModelList.length === 0) {
    return model;
  }
  const nextModel = wrapModelList.shift()(name, model);
  return recursiveWrapModel(name, nextModel, wrapModelList);
}

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

function recursiveOnEffect(
  modelName: string,
  effectName: string,
  effect: Effect,
  onEffectList: onEffect[]
): Effect {
  if (onEffectList && onEffectList.length === 0) {
    return effect;
  }
  const nextEffect = onEffectList.shift()(modelName, effectName, effect);
  return recursiveOnEffect(modelName, effectName, nextEffect, onEffectList);
}

function getOnReducers(pluginMap: PluginMap) {
  return values(pluginMap).filter(plugin => plugin.onReducer);
}

function getOnEffect(pluginMap: PluginMap) {
  return values(pluginMap).filter(plugin => plugin.onEffect);
}

function getExtraModelMap(pluginMap: PluginMap) {
  return values(pluginMap)
    .filter(plugin => plugin.extraModel)
    .map(plugin => plugin.extraModel)
    .reduce(merge, {});
}

function create<C extends Config, P extends PluginMap>(
  config: C,
  pluginMap?: P
): Store<C['initialModel'] & UnionToIntersection<P[keyof P]['extraModel']>> {
  //clone
  const {
    initialModel,
    initialState,
    middlewares,
    extraReducers = {}
  } = cloneDeep(config);

  const wrapModelList = values(pluginMap).filter(p => p.wrapModel);

  const extraModelMap: ModelMap = getExtraModelMap(pluginMap);

  const initialModelMap = entries(merge(initialModel, extraModelMap))
    .map(([name, model]) => {
      const newModel = recursiveWrapModel(name, model, wrapModelList);
      return {
        [name]: newModel
      };
    })
    .reduce(merge, {});

  // const initialModelMap = entries(merge(initialModel, extraModelMap))
  //   .map(([modelName, model]) => {
  //     const reducers = model.reducers ? model.reducers : () => ({});

  //     const effects = model.effects ? model.effects : () => ({});

  //     const nextReducers = entries(reducers())
  //       .map(([reducerName, reducer]) => ({
  //         [reducerName]: recursiveOnReducer(
  //           modelName,
  //           reducerName,
  //           reducer,
  //           cloneDeep(onReducerList)
  //         )
  //       }))
  //       .reduce(merge, {});

  //     const nextEffects = entries(effects())
  //       .map(([effectName, effects]) => ({
  //         [effectName]: recursiveOnEffect(
  //           modelName,
  //           effectName,
  //           effects,
  //           cloneDeep(onEffectList)
  //         )
  //       }))
  //       .reduce(merge, {});
  //     return {
  //       [modelName]: {
  //         ...model,
  //         reducers: () => nextReducers,
  //         effects: (dispatch, getState, delpoy) => nextEffects
  //       }1
  //     };
  //   })
  //   .reduce(merge, {});

  return _create({
    initialModel: initialModelMap,
    initialState: initialState,
    middlewares: middlewares,
    compose: config.compose,
    createStore: config.createStore,
    extraReducers: extraReducers
  }) as Store<
    C['initialModel'] & UnionToIntersection<P[keyof P]['extraModel']>
  >;
}

export { create };

export * from '@dura/types';
