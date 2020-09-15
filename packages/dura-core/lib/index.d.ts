import type { ConfiguraOptions, JsonObject, StoreSlice, UnionToIntersection, ExtractStateByStoreUnion, ExtractAction, ReducersMapOfStoreSlice, EffectsMapOfStoreSlice, CreateStoreReturn } from "@dura/types";
export declare const defaultConfiguraOptions: ConfiguraOptions;
export * from "./defineStoreSlice";
export declare function configura(options?: ConfiguraOptions): <N extends string, S extends JsonObject<any>, R extends ReducersMapOfStoreSlice<S>, E extends EffectsMapOfStoreSlice, STORES extends StoreSlice<N, S, R, E>[] = StoreSlice<N, S, R, E>[], GA = UnionToIntersection<ExtractAction<STORES[number]>>, GS = UnionToIntersection<ExtractStateByStoreUnion<STORES[number]>>>(...stores: STORES) => CreateStoreReturn<GS, GA>;
