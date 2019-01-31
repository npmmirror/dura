import { Dispatch, Store, AnyAction, DeepPartial } from "redux";

export type PayloadAction<P = any> = {
  payload?: P;
} & AnyAction;

export type MetaAction<M = any> = {
  meta?: M;
} & AnyAction;

export type DuraAction<P = any, M = any> = PayloadAction<P> & MetaAction<M>;

export type DuraDispatch = Dispatch<AnyAction>;

export type DuraStore<RootState = any, ActionCreator = any> = Store<RootState> & {
  dispatch: DuraDispatch | any;
  actionCreator: ActionCreator;
};

export type Reducers<S = any> = {
  [name: string]: (state: S, action: DuraAction) => S;
};

export type SelectRequest<S = any, R = any> = (state: S) => R;

export type ERequest<P = any, S = any, M = any> = {
  dispatch: DuraDispatch | any;
  select: (fn: SelectRequest<S>) => any;
  delay: (ms: number) => Promise<{}>;
  action: DuraAction<P, M>;
};

export type Effects<P = any, M = any> = {
  [name: string]: ((request: ERequest<P, M>) => void) | ((request: ERequest<P, M>) => () => void);
};

export type State = {
  [name: string]: number | string | object | undefined | null;
};

export interface Model<S = any> {
  state: State;
  reducers?: Reducers<S>;
  effects?: Effects<any, any>;
}

export interface RootModel {
  [name: string]: Model<any>;
}

type EffectIntercept = {
  pre: (action: DuraAction) => boolean;
  before: (action: DuraAction, dispatch: DuraDispatch) => void;
  after: (action: DuraAction, dispatch: DuraDispatch) => void;
};

export type Plugin<S = any> = {
  name: string;
  model?: Model<S>;
  wrapModel?: (model: Model<any>) => Model<any>;
  intercept?: EffectIntercept;
};

export type Config = {
  initialModel?: RootModel;
  initialState?: any;
  plugins?: Array<Plugin<any>>;
};

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ExtractRootAction<M extends RootModel> = ExtractReducersAction<M> & ExtractEffectsAction<M>;

export type ExtractReducersAction<M extends RootModel> = { [key in keyof M]: WrapReducerAction<M[key]["reducers"]> };

export type ExtractEffectsAction<M extends RootModel> = { [key in keyof M]: WrapEffectAction<M[key]["effects"]> };

export type WrapReducerAction<R extends Reducers> = { [key in keyof R]: (payload?: any, meta?: any) => DuraAction };

export type WrapEffectAction<E extends Effects> = { [key in keyof E]: (payload?: any, meta?: any) => DuraAction };
