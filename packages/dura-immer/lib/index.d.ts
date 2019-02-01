import { Model } from "@dura/types";
declare const _default: {
    name: string;
    wrapModel(name: string, model: Model<any, any>): {
        state: import("@dura/types").State;
        effects: import("@dura/types").Effects<any>;
        reducers: {
            [x: string]: (payload?: any, meta?: any) => (baseState: any) => any;
        };
    };
};
export default _default;
