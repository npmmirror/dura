import { Config, RootModel, Store, ExtractActions } from "@dura/types";
/**
 * 创建store
 * @param config
 */
declare function create<C extends Config>(config: C): Store<C["initialModel"]>;
declare function createActionCreator<S extends RootModel>(rootModel: S): ExtractActions<S>;
export { create, createActionCreator };
export { EffectApi, ExtractRootState } from "@dura/types";
