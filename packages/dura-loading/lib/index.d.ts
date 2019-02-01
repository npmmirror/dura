/**
 * 自动loading
 */
import { RootModel, Effects, Model } from "@dura/types";
declare const _default: {
    name: string;
    model: {
        state: {};
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
export default _default;
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
