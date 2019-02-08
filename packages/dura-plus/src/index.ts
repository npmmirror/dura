import { RootModel, Model, DuraStore, ExtractRootState, create, Middleware, Plugin } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore, AsyncModel, EffectAPI } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState, LoadingMeta } from "@dura/async-loading";
import { createImmerPlugin } from "@dura/immer";

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

export type DuraConfig = {
  initialState?: any;
  middlewares?: Array<Middleware>;
  plugins?: Array<Plugin>;
};

export const createDura = function(initialRootModel: RootModel<Model & AsyncModel>, config?: DuraConfig) {
  return create({
    initialModel: initialRootModel,
    plugins: [
      createAsyncPlugin(),
      createLoadingPlugin(initialRootModel),
      createImmerPlugin(),
      ...(config.plugins || [])
    ],
    initialState: config.initialState || {},
    middlewares: config.middlewares || []
  });
};
