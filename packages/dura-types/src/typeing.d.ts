import { Dispatch, Store as _Store, AnyAction, Middleware, applyMiddleware, compose, createStore } from "redux";

export { Middleware };

export type ExcludeTypeAction = {
  [name: string]: any;
};

export type EffectApi = {
  dispatch: any;
  delay: (ms: number) => Promise<{}>;
  select: (fn: (state) => any) => any;
};

export type Reducer<S, A extends ExcludeTypeAction> = (state: S, action: A) => S;

export type Effect = (effectApi: EffectApi, action: ExcludeTypeAction) => Promise<void>;

export type ReducerMap<S> = {
  [name: string]: Reducer<S, ExcludeTypeAction>;
};

export type EffectMap = {
  [name: string]: Effect;
};

export type Model<S> = {
  state: S;
  reducers: ReducerMap<S>;
  effects: EffectMap;
};

export type RootModel = {
  [name: string]: Model<any>;
};

export type Store<S> = _Store<S>;

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type Config = {
  initialModel: RootModel;
  initialState?: any;
  middlewares?: Array<Middleware>;
  compose?: typeof compose;
  createStore?: typeof createStore;
};

export type Pack<T extends ExcludeTypeAction> = "payload" | "meta" extends keyof T
  ? (payload: T["payload"], meta: T["meta"]) => AnyAction
  : "payload" extends keyof T
  ? (payload: T["payload"]) => AnyAction
  : "meta" extends keyof T
  ? (payload: null, meta: T["meta"]) => AnyAction
  : [];
