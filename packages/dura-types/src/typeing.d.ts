import {
  Dispatch,
  Store as _Store,
  AnyAction,
  Middleware,
  applyMiddleware,
  compose,
  createStore
} from 'redux';

export { Middleware };

export type ExcludeTypeAction = {
  [name: string]: any;
};

export type onReducer = (
  modelName: string,
  reducerName: string,
  reducer: Reducer<any, ExcludeTypeAction>
) => Reducer<any, ExcludeTypeAction>;

export type onEffect = (
  modelName: string,
  effectName: string,
  effect: Effect
) => Effect;

export type Plugin = {
  onReducer?: onReducer;
  onEffect?: onEffect;
  extraModel?: ModelMap;
  wrapModel?: (name: string, model: Model) => Model;
};

export type PluginMap = {
  [name: string]: Plugin;
};

export type EffectApi = {
  dispatch: any;
  delay: (ms: number) => Promise<{}>;
  select: (fn: (state) => any) => any;
};

export type Reducer<S, P = any, M = any> = (
  state: S,
  reducer: P,
  meta: M
) => void;

export type ReducerFcuntion<S> = () => ReducerMap<S>;

export type Effect<P = any, M = any> = (payload?: P, meta?: M) => Promise<void>;

export type ReducerMap<S> = {
  [name: string]: Reducer<S, ExcludeTypeAction>;
};

export type EffectMap = {
  [name: string]: Effect;
};

export type EffectFunction = (
  dispatch?: any,
  getState?: any,
  delay?: (ms: number) => Promise<void>
) => EffectMap;

export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

export type Model<S = any> = {
  state?: S;
  reducers?: ReducerFcuntion<S>;
  effects?: EffectFunction;
};

export type ModelMap = {
  [name: string]: Model<any>;
};

export type Store<RM extends ModelMap> = _Store<ExtractState<RM>>;

export type ExtractState<M extends ModelMap> = {
  [key in keyof M]: ReturnType<M[key]['state']>;
};

export type ExtractPluginState<P extends PluginMap> = UnionToIntersection<
  P[keyof P]['extraModel']
>;

export type ExtractActions<M extends ModelMap> = ExtractReducerActions<M> &
  ExtractEffectActions<M>;

export type ExtractReducerActions<M extends ModelMap> = {
  [key in keyof M]: ReviewReducders<
    ReturnType<M[key]['reducers']>,
    ReturnType<M[key]['state']>
  >;
};

export type ReviewReducders<R extends ReducerMap<S>, S> = {
  [key in keyof R]: Parameters<R[key]>[1] extends undefined
    ? () => AnyAction
    : Parameters<R[key]>[2] extends undefined
    ? (payload: Parameters<R[key]>[1]) => AnyAction
    : (
        payload: Parameters<R[key]>[1],
        meta: Parameters<R[key]>[2]
      ) => AnyAction;
};

export type ExtractEffectActions<M extends ModelMap> = {
  [key in keyof M]: ReviewEffects<ReturnType<M[key]['effects']>>;
};

export type ReviewEffects<E extends EffectMap> = {
  [key in keyof E]: Parameters<E[key]>[0] extends undefined
    ? () => AnyAction
    : Parameters<E[key]>[1] extends undefined
    ? (payload: Parameters<E[key]>[0]) => AnyAction
    : (
        payload: Parameters<E[key]>[0],
        meta: Parameters<E[key]>[1]
      ) => AnyAction;
};

export type Config = {
  initialModel: ModelMap;
  initialState?: any;
  middlewares?: Array<Middleware>;
  compose?: typeof compose;
  createStore?: typeof createStore;
  extraReducers?: any;
};
