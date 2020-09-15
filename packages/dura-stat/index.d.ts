import type {
  MapOfObject,
  Store as storeOfCore,
  createStoreFactoryOptions,
  ArrayToMap,
  createStoreFactoryReturn,
} from "@dura/core";
import type { ReducersMapObject } from "redux";
import type { UnionToIntersection } from "utility-types";

export type Store<
  N extends string,
  S = MapOfObject,
  M = ReducersMapObject<S>,
  E = MapOfObject
> = storeOfCore<N, S, M> & {
  effects?: E;
};

export type ConfiguraOptions = Omit<
  createStoreFactoryOptions<any>,
  "preloadedState"
>;

export function configura(
  options?: ConfiguraOptions
): <N extends string, M extends Store<N>, ML extends M[]>(
  models: ML,
  preloadedState?: Omit<
    createStoreFactoryOptions<UnionToIntersection<ArrayToMap<ML[number]>>>,
    "enhancers" | "middlewares"
  >
) => createStoreFactoryReturn<ML[number]>;

export function defineStore<
  N extends string,
  S = MapOfObject,
  M = ReducersMapObject<S>,
  E = MapOfObject
>(store: Store<N, S, M, E>): Store<N, S, M, E>;
