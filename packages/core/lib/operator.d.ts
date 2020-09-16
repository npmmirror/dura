import type { ReducersMapObject } from "redux";
import type { JsonObject, StoreSlice, EffectsMapOfStore, EffectsMapOfStoreSlice, ReducersMapOfStoreSlice } from "@dura/types";
export declare function operatorFactory(): {
    use: <N extends string, S extends JsonObject<any>, R extends ReducersMapOfStoreSlice<S>, E extends EffectsMapOfStoreSlice, STORES extends StoreSlice<N, S, R, E>[]>(...storeArray: STORES) => void;
    unUse: <N_1 extends string, S_1 extends JsonObject<any>, R_1 extends ReducersMapOfStoreSlice<S_1>, E_1 extends EffectsMapOfStoreSlice, STORES_1 extends StoreSlice<N_1, S_1, R_1, E_1>[]>(...storeArray: STORES_1) => void;
    getReducers: () => ReducersMapObject<any, import("redux").Action<any>>;
    getEffects: () => EffectsMapOfStore;
    has: <N_2 extends string, S_2 extends JsonObject<any>, R_2 extends ReducersMapOfStoreSlice<S_2>, E_2 extends EffectsMapOfStoreSlice, STORES_2 extends StoreSlice<N_2, S_2, R_2, E_2>>(store: STORES_2) => boolean;
};
