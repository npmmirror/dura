import core, { DuraStore, Plugin, RootModel, Model, ExtractRootState } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore, AsyncModel, EffectAPI } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState, LoadingMeta } from "@dura/async-loading";
import { createImmerPlugin } from "@dura/immer";
import { createSelectorsPlugin, SelectorsDuraStore, SelectorModel } from "@dura/selectors";

export type Config = {
  plugins: Array<Plugin>;
  initialState?: any;
  middlewares?: Array<any>;
};

export type PlusDuraStore<RM extends RootModel<Model & AsyncModel & SelectorModel>> = DuraStore<
  RM,
  ExtractLoadingState<RM>
> &
  AsyncDuraStore<RM> &
  SelectorsDuraStore<RM>;

export type PlusRootState<RM extends RootModel<Model & AsyncModel & SelectorModel>> = ExtractRootState<RM> &
  ExtractLoadingState<RM>;

export type EffectAPI<P extends RootModel> = EffectAPI<P>;

export type LoadingMeta = LoadingMeta;

export const create = function(initialRootModel: RootModel<Model & AsyncModel>, config?) {
  return core.create({
    initialModel: initialRootModel,
    plugins: [createAsyncPlugin(), createLoadingPlugin(initialRootModel), createImmerPlugin(), createSelectorsPlugin()],
    ...config
  });
};
