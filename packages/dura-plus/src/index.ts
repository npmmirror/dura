import core, { DuraStore, Plugin, RootModel, Model, ExtractRootState } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore, AsyncModel } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState } from "@dura/async-loading";
import { createImmerPlugin } from "@dura/immer";
import { createSelectorsPlugin, SelectorsDuraStore } from "@dura/selectors";

export type Config = {
  plugins: Array<Plugin>;
  initialState?: any;
  middlewares?: Array<any>;
};

export const create = function<RM>(initialRootModel: RootModel<Model & AsyncModel>, config): DuraStore<RM> {
  const RootModel = typeof initialRootModel;
  return core.create({
    initialModel: initialRootModel,
    plugins: [createAsyncPlugin(), createLoadingPlugin(initialRootModel), createImmerPlugin(), createSelectorsPlugin()],
    ...config
  }) as DuraStore<RM, ExtractLoadingState<RootModel>> & AsyncDuraStore<RM> & SelectorsDuraStore<RootModel>;
};
