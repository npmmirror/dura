/**
 * 自动loading
 */
import { RootModel, Effects, Model } from "@dura/types";
export declare const createLoadingPlugin: (rootModel: RootModel) => {
    name: string;
    model: {
        state: {
            [x: string]: {
                [x: string]: boolean;
            };
        };
        reducers: {
            start(payload: {
                modelName: string;
                effectName: string;
            }): (state: any) => any;
            end(payload: {
                modelName: string;
                effectName: string;
            }): (state: any) => any;
        };
    };
    wrapModel: (name: string, model: Model<any, any>) => Model<any, any>;
};
declare type ConvertFnToBoolean<E extends Effects> = {
    [key in keyof E]: boolean;
};
export declare type ExtractLoadingState<RMT extends RootModel> = {
    loading: {
        [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]>;
    };
};
export declare type LoadingMeta = {
    loading: boolean;
};
export {};
