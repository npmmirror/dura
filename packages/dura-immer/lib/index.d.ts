import { Model } from "@dura/types";
export declare const createImmerPlugin: () => {
    name: string;
    onWrapModel(name: string, model: Model<{}>): {
        reducers: {
            [x: string]: (baseState: any, action: any) => (state: {}) => void | {};
        };
        state: import("@dura/types").State;
    };
};
