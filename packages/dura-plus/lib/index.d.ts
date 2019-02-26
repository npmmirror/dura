import { Config as _Config, Model, Middleware, ExtractRootState } from "@dura/types";
import { actionCreator } from "@dura/actions";
declare type ExtraConfig = {
    plugins?: Plugin[];
};
declare type ConfigPlus = _Config & ExtraConfig;
export declare type Plugin = {
    name: string;
    extraModels?: {
        [name: string]: Model<any>;
    };
    onModel?: (model: Model<any>) => Model<any>;
    initialState?: any;
    middlewares?: Middleware[];
};
declare const create: <C extends ConfigPlus>(config: C) => import("redux").Store<ExtractRootState<C["initialModel"]> & ExtractRootState<C["plugins"][number]["extraModels"]>, import("redux").AnyAction>;
export { create, actionCreator };
