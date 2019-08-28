import { Config, PluginMap, UnionToIntersection } from '@dura/types';
declare const create: <C extends Config, P extends PluginMap>(config: C, pluginMap?: P) => import("redux").Store<import("@dura/types").ExtractState<C["initialModel"] & UnionToIntersection<P[keyof P]["extraModel"]>>, import("redux").AnyAction>;
export { create };
export * from '@dura/types';
