/**
 * 自动loading
 */
import { ModelMap, Plugin, EffectMap } from "@dura/types";
export declare const createLoadingModel: (modelMap: ModelMap) => {
    loading: {
        state: any;
        reducers: {
            startLoading(state: any, action: {
                payload: {
                    modelName: string;
                    effectName: string;
                };
            }): any;
            endLoading(state: any, action: {
                payload: {
                    modelName: string;
                    effectName: string;
                };
            }): any;
        };
        effects: {};
    };
};
export declare const createLoadingPlugin: <MM extends ModelMap>(modelMap: MM) => Plugin;
declare type ConvertFnToBoolean<E extends EffectMap> = {
    [key in keyof E]: boolean;
};
export declare type ExtractLoadingState<RMT extends ModelMap> = {
    loading: {
        [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]>;
    };
};
export declare type LoadingMeta = {
    loading?: boolean;
};
export {};
