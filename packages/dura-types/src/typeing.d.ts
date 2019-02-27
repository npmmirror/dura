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

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
  ? I
  : never;

export type Model<S> = {
  state: S;
  reducers: ReducerMap<S>;
  effects: EffectMap;
};

export type ModelMap = {
  [name: string]: Model<any>;
};

export type Store<RM extends ModelMap, PM extends PluginMap> = _Store<ExtractState<RM & ExtractPluginsModels<PM>>> & {
  actionCreator: ExtractActions<RM & ExtractPluginsModels<PM>>;
};

export type ExtractState<M extends ModelMap> = { [key in keyof M]: M[key]["state"] };

export type ExtractActions<M extends ModelMap> = ExtractReducerActions<M> & ExtractEffectActions<M>;

export type ExtractReducerActions<M extends ModelMap> = {
  [key in keyof M]: ReviewReducders<M[key]["reducers"], M[key]["state"]>
};

export type ReviewReducders<R extends ReducerMap<S>, S> = { [key in keyof R]: Pack<Parameters<R[key]>[1]> };

export type ExtractEffectActions<M extends ModelMap> = { [key in keyof M]: ReviewEffects<M[key]["effects"]> };

export type ReviewEffects<E extends EffectMap> = { [key in keyof E]: Pack<Parameters<E[key]>[1]> };

export type Config = {
  initialModel: ModelMap;
  initialState?: any;
  middlewares?: Array<Middleware>;
  compose?: typeof compose;
  createStore?: typeof createStore;
  plugins?: PluginMap;
};

export type Pack<T extends ExcludeTypeAction> = "payload" | "meta" extends keyof T
  ? (payload: T["payload"], meta: T["meta"]) => AnyAction
  : "payload" extends keyof T
  ? (payload: T["payload"]) => AnyAction
  : "meta" extends keyof T
  ? (payload: null, meta: T["meta"]) => AnyAction
  : () => AnyAction;

export type Plugin = {
  extraModels?: ModelMap;
  middlewares?: Middleware[];
  onModel?: OnModelFunc;
};

export type OnModelFunc = (modelName: string, model: Model<any>) => Model<any>;

export type PluginMap = {
  [name: string]: Plugin;
};

export type ExtractPluginModels<T extends PluginMap> = { [key in keyof T]: T[key]["extraModels"] };

export type ExtractPluginsModels<T extends PluginMap> = UnionToIntersection<
  ExtractPluginModels<T>[keyof ExtractPluginModels<T>]
>;
