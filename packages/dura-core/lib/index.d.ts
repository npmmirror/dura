import { Config, Store, ExtractRootState } from "@dura/types";
/**
 * 创建store
 * @param config
 */
declare function create<C extends Config>(config: C): Store<ExtractRootState<C["initialModel"]>>;
export { create };
export { EffectApi, ExtractRootState } from "@dura/types";
