import { Config, ExcludeTypeAction, Reducer, Effect } from "@dura/types";
export declare type Plugin = {
    onReducer: (reducer: Reducer<any, ExcludeTypeAction>) => Reducer<any, ExcludeTypeAction>;
    onEffect: (effect: Effect) => Effect;
};
declare const create: <C extends Config, P extends Plugin>(config: C, plugin: P) => any;
export { create };
