/**
 * 自动loading
 */
import { RootModel, Model } from "@dura/types";
import { Effects, AsyncModel } from "@dura/async";
export declare const createLoadingPlugin: (rootModel: RootModel<Model<any, any>>) => {
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
    onWrapModel: (name: string, model: Model<any, any> & AsyncModel) => Model<any, any> & AsyncModel;
};
declare type ConvertFnToBoolean<E extends Effects> = {
    [key in keyof E]: boolean;
};
export declare type ExtractLoadingState<RMT extends RootModel<Model & AsyncModel>> = {
    loading: {
        [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]>;
    };
};
export declare type LoadingMeta = {
    loading: boolean;
};
export {};
