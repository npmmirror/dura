import { defineStoreSlice } from "@dura/core";
import type { ConfiguraOptions, JsonObject, ReducersMapOfStoreSlice, EffectsMapOfStoreSlice, StoreSlice, UnionToIntersection, ExtractAction, ExtractStateByStoreUnion, CreateStoreReturn } from "@dura/types";
export interface Return<S, A> extends CreateStoreReturn<S, A> {
    useMount: () => void;
    useStore: <T>(deps?: T[]) => S;
    useActions: () => A;
}
export interface Next<SS, A> {
    <N extends string, S extends JsonObject, R extends ReducersMapOfStoreSlice<S>, E extends EffectsMapOfStoreSlice, STORES extends StoreSlice<N, S, R, E>[] = StoreSlice<N, S, R, E>[], GA = UnionToIntersection<ExtractAction<STORES[number]>>, GS = UnionToIntersection<ExtractStateByStoreUnion<STORES[number]>>>(...stores: STORES): Return<GS & SS, GA & A>;
}
export { defineStoreSlice };
export declare function configura(options?: ConfiguraOptions): <N extends string, S extends JsonObject<any>, R extends ReducersMapOfStoreSlice<S>, E extends EffectsMapOfStoreSlice, STORES extends StoreSlice<N, S, R, E>[] = StoreSlice<N, S, R, E>[], GA = UnionToIntersection<ExtractAction<STORES[number]>>, GS = UnionToIntersection<ExtractStateByStoreUnion<STORES[number]>>>(...stores: STORES) => Next<GS, GA>;
