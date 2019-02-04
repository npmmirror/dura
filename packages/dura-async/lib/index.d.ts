import { RootModel, Model, Plugin, Payload, Meta } from "@dura/types";
export declare const createAsyncPlugin: () => Plugin<any>;
export declare type AsyncModel = {
    effects?: {
        [name: string]: any;
    };
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
export declare type EffectAPI<RootState = any> = {
    dispatch: any;
    getState: () => RootState;
    delay: (ms: number) => Promise<{}>;
};
