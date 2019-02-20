import { Dispatch, Store, AnyAction, DeepPartial, Middleware, applyMiddleware, compose, createStore } from "redux";

export type Payload = {
  [name: string]: any;
};

export type Meta = {
  [name: string]: any;
};

export type Middleware = Middleware;

export type DuraAction<P extends Payload = any, M extends Meta = any> = {
  type: string;
  payload?: P;
  meta?: M;
  error?: boolean;
};

export type Dispatch = Dispatch;

export type DuraStore<RM extends RootModel = {}, ExtensionState extends RootModel = {}> = Store<
  ExtractRootState<RM> & ExtensionState
> & {
  dispatch: Dispatch;
  reducerRunner: ExtractReducersRunner<RM>;
};

export type Reducers<S = any> = {
  [name: string]: (state: S, action) => S;
};

export type State = {
  [name: string]: any;
};

export interface Model<ModelState = {}> {
  state: State;
  reducers?: Reducers<ModelState>;
}

export interface RootModel<M = any> {
  [name: string]: M;
}

export type Plugin<S = any> = {
  name: string;
  model?: Model<S>;
  onWrapModel?: (name: string, model: Model<any>) => Model<any>;
  onCreateMiddleware?: (rootModel: RootModel) => Middleware;
  onStoreCreated?: (store: DuraStore, rootModel: RootModel) => void;
};

export type Config = {
  initialModel?: RootModel;
  initialState?: any;
  middlewares?: Array<Middleware>;
  plugins?: Array<Plugin<any>>;
  compose?: typeof compose;
  createStore?: typeof createStore;
};

type Pack<T extends { payload?: {}; meta?: {} }> = "payload" | "meta" extends keyof T
  ? (payload: T["payload"], meta: T["meta"]) => void
  : "payload" extends keyof T
  ? (payload: T["payload"]) => void
  : "meta" extends keyof T
  ? (payload: null, meta: T["meta"]) => void
  : [];

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ReviewReducders<R extends Reducers> = { [key in keyof R]: Pack<Parameters<R[key]>[1]> };

export type ExtractReducersRunner<M extends RootModel> = { [key in keyof M]: ReviewReducders<M[key]["reducers"]> };
