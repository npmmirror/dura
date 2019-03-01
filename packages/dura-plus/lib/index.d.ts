import { Config, Store, PluginMap } from "@dura/types";
declare const create: <C extends Config, P extends PluginMap>(config: C, pluginMap?: P) => Store<C["initialModel"] & import("../../dura-types/src/typeing").UnionToIntersection<P[keyof P]["extraModel"]>>;
export { create };
export * from "@dura/core";
