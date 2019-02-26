import { create as _create } from "@dura/core";
import _ from "lodash";
import {
  Config as _Config,
  Model,
  Middleware,
  Store,
  ExtractRootState,
  UnionToIntersection,
  RootModel
} from "@dura/types";
import { actionCreator as _actionCreator } from "@dura/actions";

type ExtraConfig = {
  plugins?: Plugin[];
};

type ConfigPlus = _Config & ExtraConfig;

export type Plugin = {
  name: string;
  extraModels?: {
    [name: string]: Model<any>;
  };
  onModel?: (model: Model<any>) => Model<any>;
  initialState?: any;
  middlewares?: Middleware[];
};

const create = function<C extends ConfigPlus>(config: C) {
  const { initialModel = {}, plugins = [], initialState } = _.cloneDeep(config);

  const finalModels = _.merge(
    initialModel,
    plugins
      .filter(p => p.extraModels)
      .map(p => p.extraModels)
      .reduce(_.merge, {})
  );

  const finalMiddlewares = plugins
    .filter(p => p.middlewares)
    .map(p => p.middlewares)
    .reduce(_.merge, {});

  return {
    startStore: function() {
      return _create({
        initialModel: finalModels,
        initialState: initialState,
        middlewares: finalMiddlewares,
        compose: config.compose,
        createStore: config.createStore
      }) as Store<
        ExtractRootState<C["initialModel"]> & UnionToIntersection<ExtractRootState<C["plugins"][number]["extraModels"]>>
      >;
    },
    getActionCreator: function() {
      return _actionCreator(finalModels);
    }
  };
};

export { create };
