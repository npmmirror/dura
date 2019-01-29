/**
 * 自动loading
 */
import { ExtractRootEffects, RootModel } from "@dura/types";
declare const _default: {
    name: string;
    model: {
        state: {};
        reducers: {
            onChangeLoading(state: any, action: any): any;
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
export declare type ExtractLoadingState<RMT extends RootModel> = {
    loading: ExtractRootEffects<RMT>;
};
