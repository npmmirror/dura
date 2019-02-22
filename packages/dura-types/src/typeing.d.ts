import {
  Dispatch,
  Store as _Store,
  AnyAction,
  DeepPartial,
  Middleware,
  applyMiddleware,
  compose,
  createStore
} from "redux";

export type ExcludeTypeAction = {
  [name: string]: any;
};

export type Reducer<S, A extends ExcludeTypeAction> = (state: S, action: A) => S;

export type ReducerMap<S> = {
  [name: string]: Reducer<S, {}>;
};

export type Model<S> = {
  state: S;
  reducers?: ReducerMap<S>;
};

export type RootModel = {
  [name: string]: Model<any>;
};

export type Store<RM extends RootModel = any> = _Store<ExtractRootState<RM>> & {
  actions: ExtractReducerActions<RM>;
};

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ReviewReducders<R extends ReducerMap<any>> = { [key in keyof R]: Pack<Parameters<R[key]>[1]> };

export type ExtractReducerActions<M extends RootModel> = { [key in keyof M]: ReviewReducders<M[key]["reducers"]> };

export type Plugin<S = any> = {
  name: string;
  model?: Model<S>;
  onWrapModel?: (name: string, model: Model<any>) => Model<any>;
  onCreateMiddleware?: (rootModel: RootModel) => Middleware;
  onStoreCreated?: (store: Store, rootModel: RootModel) => void;
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
  ? (payload: T["payload"], meta: T["meta"]) => AnyAction
  : "payload" extends keyof T
  ? (payload: T["payload"]) => AnyAction
  : "meta" extends keyof T
  ? (payload: null, meta: T["meta"]) => AnyAction
  : [];
