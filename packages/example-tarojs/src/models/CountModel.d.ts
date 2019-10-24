declare const _default: {
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
export default _default;
