import {
  Reducer,
  Effect,
  ModelMap,
  Model,
  Config,
  Store,
  ExtractState,
} from "@dura/core";

export type onReducer = (
  modelName?: string,
  reducerName?: string,
  reducer?: Reducer
) => Reducer;

export type onEffect = (
  modelName?: string,
  effectName?: string,
  effect?: Effect
) => Effect;

export type Plugin = {
  onReducer?: onReducer;
  onEffect?: onEffect;
  extraModel?: ModelMap;
  wrapModel?: (name: string, model: Model) => Model;
};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type PluginMap = {
  [name: string]: Plugin;
};

export type StoreCreatorPlus = <C extends Config, P extends PluginMap>(
  config: C,
  plugin?: P
) => Store<
  ExtractState<
    C["initialModel"] & UnionToIntersection<P[keyof P]["extraModel"]>
  >
>;

export const create: StoreCreatorPlus;

export { ModelMap, EffectMap } from "@dura/core";
