import { Model } from "@dura/types";
export declare const createImmerPlugin: () => {
    name: string;
    onWrapModel(name: string, model: Model<any, any>): {
        reducers: {
            [x: string]: (payload?: any, meta?: any) => (baseState: any) => any;
        };
        state: import("@dura/types").State;
    };
};
