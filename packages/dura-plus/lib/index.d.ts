import { Config, Store, PluginMap, UnionToIntersection } from '@dura/types';
declare function create<C extends Config, P extends PluginMap>(config: C, pluginMap?: P): Store<C['initialModel'] & UnionToIntersection<P[keyof P]['extraModel']>>;
export { create };
export * from '@dura/types';
