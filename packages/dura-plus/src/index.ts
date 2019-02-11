import { RootModel, Model, DuraStore, ExtractRootState, create, Middleware, Plugin, Config } from "@dura/core";
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

export type EffectAPI<RootState = any> = EffectAPI<RootState>;

export type LoadingMeta = LoadingMeta;

export type DuraConfig = Pick<Config, "initialState" | "middlewares" | "plugins" | "compose" | "createStore">;

export const createDura = function(initialRootModel: RootModel<Model & AsyncModel>, config?: DuraConfig) {
  const otherPlugins = config.plugins || [];
  return create({
    initialModel: initialRootModel,
    plugins: [createAsyncPlugin(), createLoadingPlugin(initialRootModel), ...otherPlugins],
    initialState: config.initialState || {},
    middlewares: config.middlewares || [],
    compose: config.compose,
    createStore: config.createStore
  });
};
