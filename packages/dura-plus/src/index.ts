import { create as _create } from "@dura/core";
import _ from "lodash";
import { Config, ExcludeTypeAction, Reducer, Effect, Model, Store, onReducer, Plugin } from "@dura/types";

function recursiveOnReducer(modelName: string, reducer: Reducer<any, ExcludeTypeAction>, onReducerList: onReducer[]) {
  if (onReducerList && onReducerList.length === 0) {
    return reducer;
  }
  const nextReducer = onReducerList.shift()(modelName, reducer);
  return recursiveOnReducer(modelName, nextReducer, onReducerList);
}

function recursiveOnEffect(modelName: string, effect: Effect, onEffectList: onReducer[]) {
  if (onEffectList && onEffectList.length === 0) {
    return effect;
  }
  const nextEffect = onEffectList.shift()(modelName, effect);
  return recursiveOnEffect(modelName, nextEffect, onEffectList);
}

const create = function<C extends Config, P extends Plugin>(config: C, plugins: P[]): Store<C["initialModel"]> {
  const { initialModel, initialState, middlewares } = _.cloneDeep(config);

  const onReducerList = plugins.filter(plugin => plugin.onReducer).map(plugin => plugin.onReducer);

  const onEffectList = plugins.filter(plugin => plugin.onEffect).map(plugin => plugin.onEffect);

  const initialModelMap = _.keys(initialModel)
    .map((name: string) => {
      const model: Model<any> = initialModel[name];

      const reducers = _.entries(model.reducers)
        .map(([name, reducer]) => ({
          [name]: recursiveOnReducer(name, reducer, onReducerList)
        }))
        .reduce(_.merge, {});

      const effects = _.entries(model.effects)
        .map(([name, effect]) => ({
          [name]: recursiveOnEffect(name, effect, onEffectList)
        }))
        .reduce(_.merge, {});

      return {
        [name]: _.merge(model, { reducers, effects })
      };
    })
    .reduce(_.merge, {});

  return _create({
    initialModel: initialModelMap,
    initialState: initialState,
    middlewares: middlewares,
    compose: config.compose,
    createStore: config.createStore
  });
};

export { create };
