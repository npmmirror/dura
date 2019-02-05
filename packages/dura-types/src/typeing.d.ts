import { Dispatch, Store, AnyAction, DeepPartial, Middleware, applyMiddleware } from "redux";

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
  [name: string]: (payload?: Payload, meta?: Meta) => (state: S) => S | void;
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
};

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ExtractReducersRunner<M extends RootModel> = { [key in keyof M]: M[key]["reducers"] };
