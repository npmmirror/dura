import { RootModel, Model, DuraStore, ExtractRootState, create as _create, Plugin, Config } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore, AsyncModel, EffectAPI } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState, LoadingMeta } from "@dura/async-loading";

export type Config = {
  plugins: Array<Plugin>;
  initialState?: any;
  middlewares?: Array<any>;
};

export type PlusDuraStore<RM extends RootModel<Model & AsyncModel>> = DuraStore<RM, ExtractLoadingState<RM>> &
  AsyncDuraStore<RM>;

export type PlusRootState<RM extends RootModel<Model & AsyncModel>> = ExtractRootState<RM> & ExtractLoadingState<RM>;

export type EffectAPI = EffectAPI;

export type LoadingMeta = LoadingMeta;

export type DuraConfig = Pick<Config, "initialState" | "middlewares" | "plugins" | "compose" | "createStore">;

export const create = function(initialRootModel: RootModel<Model & AsyncModel>, config?: DuraConfig) {
  const otherPlugins = config.plugins || [];
  return _create({
    initialModel: initialRootModel,
    plugins: [createAsyncPlugin(), createLoadingPlugin(initialRootModel), ...otherPlugins],
    initialState: config.initialState || {},
    middlewares: config.middlewares || [],
    compose: config.compose,
    createStore: config.createStore
  });
};
