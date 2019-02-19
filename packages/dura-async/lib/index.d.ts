import { RootModel, Model, Plugin, Payload, Meta, Pack } from "@dura/types";
export declare const createAsyncPlugin: () => Plugin<any>;
export declare type AsyncModel = {
    effects?: {
        [name: string]: any;
    };
};
export declare type ExtractEffectsRunner<M extends RootModel<Model & AsyncModel>> = {
    [key in keyof M]: ReviewEffects<M[key]["effects"]>;
};
export declare type AsyncDuraStore<M extends RootModel = any> = {
    effectRunner: ExtractEffectsRunner<M>;
};
export declare type Effect = (request: EffectAPI) => void;
export declare type ReviewEffects<E extends Effects> = {
    [key in keyof E]: Pack<Parameters<E[key]>[0]>;
};
export declare type Effects = {
    [name: string]: (payload?: Payload, meta?: Meta) => Effect;
};
export declare type EffectAPI = {
    dispatch: any;
    delay: (ms: number) => Promise<{}>;
    select: (fn: (state: any) => any) => any;
};
