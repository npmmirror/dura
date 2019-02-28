import { create as _create } from "@dura/core";
import _ from "lodash";
import { Config, ExcludeTypeAction, Reducer, Effect } from "@dura/types";

export type Plugin = {
  onReducer: (reducer: Reducer<any, ExcludeTypeAction>) => Reducer<any, ExcludeTypeAction>;
  onEffect: (effect: Effect) => Effect;
};

const create = function<C extends Config, P extends Plugin>(config: C, plugin: P) {
  const { initialModel = {}, initialState, middlewares } = _.cloneDeep(config);
  return _create({
    initialModel: initialModel,
    initialState: initialState,
    middlewares: middlewares,
    compose: config.compose,
    createStore: config.createStore
  });
};

export { create };
