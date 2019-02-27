import { create as _create } from "@dura/core";
import _ from "lodash";
import { Config as _Config, Model, Middleware, Store, UnionToIntersection } from "@dura/types";
import { actionCreator as _actionCreator } from "@dura/actions";

type ExtraConfig = {
  plugins?: {
    [name: string]: Plugin;
  };
};

type ConfigPlus = _Config & ExtraConfig;

export type Plugin = {
  extraModels?: {
    [name: string]: Model<any>;
  };
  onModel?: (model: Model<any>) => Model<any>;
  initialState?: any;
  middlewares?: Middleware[];
};

const create = function<C extends ConfigPlus>(
  config: C
) {
  const { initialModel = {}, plugins = {}, initialState, middlewares } = _.cloneDeep(config);

  const finalModels = _.merge(
    initialModel,
    _.keys(plugins)
      .map((k: string) => plugins[k].extraModels || {})
      .reduce(_.merge, {})
  );

  _.keys(plugins)
    .map((k: string) => plugins[k].middlewares || [])
    .reduce(_.merge, []);

  const finalMiddlewares = _.merge(
    middlewares,
    _.keys(plugins)
      .map((k: string) => plugins[k].middlewares || [])
      .reduce(_.merge, [])
  );

  return _create({
    initialModel: finalModels,
    initialState: initialState,
    middlewares: finalMiddlewares,
    compose: config.compose,
    createStore: config.createStore
  }) ;
};

export { create };
