/**
 * 自动loading
 */
import { RootModel, Model, Meta } from "@dura/types";
export declare const createLoadingPlugin: (rootModel: RootModel<Model<any, any>>) => {
    name: string;
    model: {
        state: {
            [x: string]: {
                [x: string]: boolean;
            };
        };
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
    wrapModel: (name: string, model: Model<any, any>) => Model<any, any> | {
        state: import("@dura/types").State;
        reducers: import("@dura/types").Reducers<any>;
        effects: {
            [x: string]: (payload?: any, meta?: Meta) => (request: any) => Promise<void>;
        };
    };
};
