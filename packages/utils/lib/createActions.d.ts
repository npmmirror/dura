import type { Store as ReduxStore } from "redux";
import type { StoreSlice, JsonObject, ReducersMapOfStoreSlice, EffectsMapOfStoreSlice, ExtractAction, UnionToIntersection } from "@dura/types";
export declare function createDispatch<S>(reduxStore: ReduxStore<S>, namespace: string, methodName: string): (payload: any) => {
    type: string;
    payload: any;
};
export declare function createActionsFactory<S>(reduxStore: ReduxStore<S>): <N extends string, S_1 extends JsonObject<any>, R extends ReducersMapOfStoreSlice<S_1> = {}, E extends EffectsMapOfStoreSlice = {}, STORES extends StoreSlice<N, S_1, R, E>[] = StoreSlice<N, S_1, R, E>[], RETURN = UnionToIntersection<ExtractAction<STORES[number]>>>(...stores: STORES) => RETURN;
