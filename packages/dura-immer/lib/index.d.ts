import { Model } from "@dura/types";
declare const _default: {
    name: string;
    wrapModel(name: string, model: Model<any, any>): {
        reducers: {
            [x: string]: (payload?: any, meta?: any) => (baseState: any) => any;
        };
        state: import("@dura/types").State;
    };
};
export default _default;
