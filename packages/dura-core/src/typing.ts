import { Dispatch, Store, AnyAction, DeepPartial } from "redux";

export type PayloadAction<P> = {
  payload?: P;
} & AnyAction;

export type MetaAction<M> = {
  meta?: M;
} & AnyAction;

export type DuraAction<P, M> = PayloadAction<P> & MetaAction<M>;

export type DuraDispatch = Dispatch<AnyAction>;

export type DuraStore<P, M> = Store & {
  dispatch: DuraDispatch;
};

export type Reducers<S, P, M> = {
  [name: string]: (state: S, action: DuraAction<P, M>) => S;
};

export type RequestForEffect<P, M> = {
  dispatch: DuraDispatch;
  getState: () => any;
  action: DuraAction<P, M>;
};

export type Effects<P, M> = {
  [name: string]: (request: RequestForEffect<P, M>) => void;
};

export type State = {
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

type EffectIntercept = {
  pre: (action: DuraAction<any, any>) => boolean;
  before: (action: DuraAction<any, any>, dispatch: any) => void;
  after: (action: DuraAction<any, any>, dispatch: any) => void;
};

export type Plugin<S> = {
  name: string;
  model: Model<S>;
  wrapModel: (model: Model<any>) => Model<any>;
  intercept: EffectIntercept;
};

export type Config = {
  initialModel?: RootModel;
  initialState?: DeepPartial<any>;
  plugins?: Array<Plugin<any>>;
};

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ReviewReducersParam<R extends Reducers<any, any, any>> = {
  [key in keyof R]: (payload?: any, meta?: any) => R[key]
};

export type ExtractRootReducers<M extends RootModel> = { [key in keyof M]: ReviewReducersParam<M[key]["reducers"]> };

export type ReviewEffectsParam<E extends Effects<any, any>> = {
  [key in keyof E]: (payload?: any, meta?: any) => E[key]
};

export type ExtractRootEffects<M extends RootModel> = { [key in keyof M]: ReviewEffectsParam<M[key]["effects"]> };

export type ExtractDispatch<M extends RootModel> = ExtractRootEffects<M> & ExtractRootReducers<M> & DuraDispatch;
