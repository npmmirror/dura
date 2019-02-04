import * as core from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore, AsyncModel, EffectAPI } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState, LoadingMeta } from "@dura/async-loading";
import { createImmerPlugin } from "@dura/immer";
import { createSelectorsPlugin, SelectorsDuraStore, SelectorModel } from "@dura/selectors";

export type Config = {
  plugins: Array<Plugin>;
  initialState?: any;
  middlewares?: Array<any>;
};

export type PlusDuraStore<RM extends core.RootModel<core.Model & AsyncModel & SelectorModel>> = core.DuraStore<
  RM,
  ExtractLoadingState<RM>
> &
  AsyncDuraStore<RM> &
  SelectorsDuraStore<RM>;

export type PlusRootState<RM extends core.RootModel<core.Model & AsyncModel & SelectorModel>> = core.ExtractRootState<RM> &
  ExtractLoadingState<RM>;

export type EffectAPI<RootState = any> = EffectAPI<RootState>;

export type LoadingMeta = LoadingMeta;

export const create = function(initialRootModel: core.RootModel<core.Model & AsyncModel>, config?) {
  return core.create({
    initialModel: initialRootModel,
    plugins: [createAsyncPlugin(), createLoadingPlugin(initialRootModel), createImmerPlugin(), createSelectorsPlugin()],
    ...config
  });
};
