import { RootModel, Model, Plugin, Payload, Meta, ExtractRootState } from "@dura/types";
export declare const createAsyncPlugin: (rootModel: RootModel<Model<any, any>>) => Plugin<any>;
export declare type AsyncModel = {
    effects?: any;
};
export declare type ExtractEffectsRunner<M extends RootModel<Model & AsyncModel>> = {
    [key in keyof M]: M[key]["effects"];
};
export declare type AsyncDuraStore<M extends RootModel = any> = {
    effectRunner: ExtractEffectsRunner<M>;
};
export declare type Effect<RM extends RootModel<Model> = any> = (request: EffectAPI<RM>) => void;
export declare type Effects<RM extends RootModel<Model> = any> = {
    [name: string]: (payload?: Payload, meta?: Meta) => Effect<RM>;
};
export declare type EffectAPI<RM extends RootModel<Model & AsyncModel> = any> = {
    dispatch: any;
    getState: () => ExtractRootState<RM>;
    delay: (ms: number) => Promise<{}>;
};
