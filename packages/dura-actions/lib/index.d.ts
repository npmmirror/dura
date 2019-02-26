import { RootModel, ReducerMap, Pack, EffectMap } from "@dura/types";
declare function actionCreator<S extends RootModel>(rootModel: S): ExtractActions<S>;
declare type ExtractActions<M extends RootModel> = ExtractReducerActions<M> & ExtractEffectActions<M>;
declare type ExtractReducerActions<M extends RootModel> = {
    [key in keyof M]: ReviewReducders<M[key]["reducers"], M[key]["state"]>;
};
declare type ReviewReducders<R extends ReducerMap<S>, S> = {
    [key in keyof R]: Pack<Parameters<R[key]>[1]>;
};
declare type ExtractEffectActions<M extends RootModel> = {
    [key in keyof M]: "effects" extends keyof M[key] ? ReviewEffects<M[key]["effects"]> : never;
};
declare type ReviewEffects<E extends EffectMap> = {
    [key in keyof E]: Pack<Parameters<E[key]>[1]>;
};
export { actionCreator };
