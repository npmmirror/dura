/**
 * 自动loading
 */
import { RootModel, Effects } from "@dura/types";
declare const _default: {
    name: string;
    model: {
        state: {};
        reducers: {
            onChangeLoading(payload: {
                name: string;
                fnName: string;
                loading: true;
            }): (state: any) => any;
        };
    };
    wrapModel: (model: any) => any;
    intercept: {
        pre: (action: any) => any;
        before: (action: any, dispatch: any) => void;
        after: (action: any, dispatch: any) => void;
    };
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
