import { RootModel, Model, DuraStore, ExtractRootState, Middleware, Plugin } from "@dura/core";
import { AsyncDuraStore, AsyncModel, EffectAPI } from "@dura/async";
import { ExtractLoadingState, LoadingMeta } from "@dura/async-loading";
export declare type Config = {
    plugins: Array<Plugin>;
    initialState?: any;
    middlewares?: Array<any>;
};
export declare type PlusDuraStore<RM extends RootModel<Model & AsyncModel>> = DuraStore<RM, ExtractLoadingState<RM>> & AsyncDuraStore<RM>;
export declare type PlusRootState<RM extends RootModel<Model & AsyncModel>> = ExtractRootState<RM> & ExtractLoadingState<RM>;
export declare type EffectAPI<RootState = any> = EffectAPI<RootState>;
export declare type LoadingMeta = LoadingMeta;
export declare type DuraConfig = {
    initialState?: any;
    middlewares?: Array<Middleware>;
    plugins?: Array<Plugin>;
};
export declare const createDura: (initialRootModel: RootModel<Model<{}> & AsyncModel>, config?: DuraConfig) => DuraStore<{}, {}>;
