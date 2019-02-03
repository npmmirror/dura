import { Model } from "@dura/types";
export declare const createImmerPlugin: () => {
    name: string;
    onWrapModel(name: string, model: Model<{}, {}>): {
        reducers: {
            [x: string]: (payload?: any, meta?: any) => (baseState: any) => {};
        };
        state: import("@dura/types").State;
    };
};
