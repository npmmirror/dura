import core, { Plugin } from "@dura/core";
import { AsyncModel } from "@dura/async";
export declare type Config = {
    plugins: Array<Plugin>;
    initialState?: any;
    middlewares?: Array<any>;
};
export declare const create: <RM>(initialRootModel: core.RootModel<core.Model<{}, {}> & AsyncModel>, config: any) => core.DuraStore<RM, {}>;
