import core, { DuraStore, Plugin, RootModel, Model, ExtractRootState } from "@dura/core";
import { AsyncDuraStore, AsyncModel, EffectAPI } from "@dura/async";
import { ExtractLoadingState, LoadingMeta } from "@dura/async-loading";
import { SelectorsDuraStore, SelectorModel } from "@dura/selectors";
export declare type Config = {
    plugins: Array<Plugin>;
    initialState?: any;
    middlewares?: Array<any>;
};
export declare type PlusDuraStore<RM extends RootModel<Model & AsyncModel & SelectorModel>> = DuraStore<RM, ExtractLoadingState<RM>> & AsyncDuraStore<RM> & SelectorsDuraStore<RM>;
export declare type PlusRootState<RM extends RootModel<Model & AsyncModel & SelectorModel>> = ExtractRootState<RM> & ExtractLoadingState<RM>;
export declare type EffectAPI<P extends RootModel> = EffectAPI<P>;
export declare type LoadingMeta = LoadingMeta;
export declare const create: (initialRootModel: core.RootModel<core.Model<{}> & AsyncModel>, config?: any) => core.DuraStore<{}, {}>;
