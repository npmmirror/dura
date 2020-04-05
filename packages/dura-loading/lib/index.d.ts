import { ModelMap, EffectMap, Plugin } from "@dura/plus";
export declare const createLoadingPlugin: <MM extends any>(modelMap: MM) => Plugin;
declare type ConvertFnToBoolean<E extends EffectMap> = {
    [key in keyof E]: boolean;
};
export declare type ExtractLoadingState<RMT extends ModelMap> = {
    loading: {
        [key in keyof RMT]: ConvertFnToBoolean<ReturnType<RMT[key]["effects"]>>;
    };
};
export declare type LoadingMeta = {
    loading?: boolean;
};
export {};
