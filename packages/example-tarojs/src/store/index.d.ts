import { ExtractState } from '@dura/plus';
import { ExtractLoadingState } from '@dura/loading';
declare const initialModel: {
    count: {
        state: () => {
            count: number;
        };
        reducers: () => {
            onChangeCount(state: {
                count: number;
            }, payload: {
                count: number;
            }): {
                count: number;
            };
        };
        effects: (dispatch: any, getState: any, delay: any) => {
            onAsyncChangeCount(payload: {
                count: number;
            }, meta?: {
                loading: boolean;
            }): Promise<void>;
        };
    };
};
export declare type RootModel = typeof initialModel;
export declare type RootState = ExtractState<RootModel> & ExtractLoadingState<RootModel>;
export declare const store: import("@dura/types").Store<{
    count: {
        state: () => {
            count: number;
        };
        reducers: () => {
            onChangeCount(state: {
                count: number;
            }, payload: {
                count: number;
            }): {
                count: number;
            };
        };
        effects: (dispatch: any, getState: any, delay: any) => {
            onAsyncChangeCount(payload: {
                count: number;
            }, meta?: {
                loading: boolean;
            }): Promise<void>;
        };
    };
} & import("@dura/types").ModelMap>;
declare const actionCreator: import("@dura/types").ExtractActions<{
    count: {
        state: () => {
            count: number;
        };
        reducers: () => {
            onChangeCount(state: {
                count: number;
            }, payload: {
                count: number;
            }): {
                count: number;
            };
        };
        effects: (dispatch: any, getState: any, delay: any) => {
            onAsyncChangeCount(payload: {
                count: number;
            }, meta?: {
                loading: boolean;
            }): Promise<void>;
        };
    };
}>;
export { actionCreator };
