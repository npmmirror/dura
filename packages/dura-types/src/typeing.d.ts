import { Dispatch, Store, AnyAction, DeepPartial, Middleware, applyMiddleware } from "redux";

export type Payload = {
  [name: string]: any;
};

export type Meta = {
  [name: string]: any;
};

export type DuraAction<P extends Payload = any, M extends Meta = any> = {
  type: string;
  payload?: P;
  meta?: M;
  error?: boolean;
};

export type DuraStore<RM extends RootModel = any> = Store<ExtractRootState<RM>> & {
  dispatch: Dispatch;
  reducerRunner: ExtractReducersRunner<RM>;
};

export type Reducers<S = any> = {
  [name: string]: (payload?: Payload, meta?: Meta) => (state: S) => S;
};

export type Effect<RootState> = (request: EffectAPI<RootState>) => void;

export type Effects<RootState = any> = {
  [name: string]: (payload?: Payload, meta?: Meta) => Effect<RootState>;
};

export type EffectAPI<RootState = any> = {
  dispatch: Dispatch;
  getState: () => RootState;
  delay: (ms: number) => Promise<{}>;
};

export type State = {
  [name: string]: number | string | object | undefined | null;
};

export interface Model<ModelState = any, RootState = any> {
  state: State;
  reducers?: Reducers<ModelState>;
  effects?: Effects<RootState>;
}

export interface RootModel<M extends Model = Model> {
  [name: string]: M;
}

export type Plugin<S = any> = {
  name: string;
  model?: Model<S>;
  wrapModel?: (name: string, model: Model<any>) => Model<any>;
  middleware?: Middleware<any, S, any>;
  onStoreCreated?: (store: DuraStore) => void;
};

export type Config = {
  initialModel?: RootModel;
  initialState?: any;
  plugins?: Array<Plugin<any>>;
};

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ExtractReducersRunner<M extends RootModel> = { [key in keyof M]: M[key]["reducers"] };
