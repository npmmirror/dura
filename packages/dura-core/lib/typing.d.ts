import { Dispatch, Store, AnyAction, DeepPartial } from "redux";
export declare type PayloadAction<P> = {
    payload?: P;
} & AnyAction;
export declare type MetaAction<M> = {
    meta?: M;
} & AnyAction;
export declare type DuraAction<P, M> = PayloadAction<P> & MetaAction<M>;
export declare type DuraDispatch = Dispatch<AnyAction>;
export declare type DuraStore<P, M> = Store & {
    dispatch: DuraDispatch;
};
export declare type Reducers<S, P, M> = {
    [name: string]: (state: S, action: DuraAction<P, M>) => S;
};
export declare type RequestForEffect<P, M> = {
    dispatch: DuraDispatch;
    getState: () => any;
    action: DuraAction<P, M>;
};
export declare type Effects<P, M> = {
    [name: string]: (request: RequestForEffect<P, M>) => void;
};
export declare type State = {
    [name: string]: number | string | object | undefined | null;
};
export interface Model<S> {
    state: State;
    reducers?: Reducers<S, any, any>;
    effects?: Effects<any, any>;
}
export interface RootModel {
    [name: string]: Model<any>;
}
declare type EffectIntercept = {
    pre: (action: DuraAction<any, any>) => boolean;
    before: (action: DuraAction<any, any>, dispatch: any) => void;
    after: (action: DuraAction<any, any>, dispatch: any) => void;
};
export declare type Plugin<S> = {
    name: string;
    model: Model<S>;
    wrapModel: (model: Model<any>) => Model<any>;
    intercept: EffectIntercept;
};
export declare type Config = {
    initialModel?: RootModel;
    initialState?: DeepPartial<any>;
    plugins?: Array<Plugin<any>>;
};
export declare type ExtractRootState<M extends RootModel> = {
    [key in keyof M]: M[key]["state"];
};
export declare type ReviewReducersParam<R extends Reducers<any, any, any>> = {
    [key in keyof R]: (payload?: any, meta?: any) => R[key];
};
export declare type ExtractRootReducers<M extends RootModel> = {
    [key in keyof M]: ReviewReducersParam<M[key]["reducers"]>;
};
export declare type ReviewEffectsParam<E extends Effects<any, any>> = {
    [key in keyof E]: (payload?: any, meta?: any) => E[key];
};
export declare type ExtractRootEffects<M extends RootModel> = {
    [key in keyof M]: ReviewEffectsParam<M[key]["effects"]>;
};
export declare type ExtractDispatch<M extends RootModel> = ExtractRootEffects<M> & ExtractRootReducers<M> & DuraDispatch;
export {};
