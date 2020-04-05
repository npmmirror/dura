import { Dispatch, Middleware, Store } from "redux";
import { DelayFn } from "@dura/utils";

export interface Reducer {
  (state?: any, payload?: any, meta?: any): void | any;
}

export interface Effect {
  (payload?: any, meta?: any): void;
}

export interface ReducerMap {
  [name: string]: Reducer;
}

export interface EffectMap {
  [name: string]: Effect;
}

export interface StateFactory {
  (): any;
}

export type ReducerFactory = () => ReducerMap;

export interface EffectFactory {
  <S>(dispatch?: Dispatch, getState?: S, delay?: DelayFn): EffectMap;
}

export type Model = {
  state: StateFactory;
  reducers: ReducerFactory;
  effects: EffectFactory;
};

export interface ModelMap {
  [name: string]: Model;
}

export interface Config<IS = any> {
  initialModel: ModelMap;
  initialState?: IS;
  middlewares?: Middleware[];
  compose?: any;
  createStore?: any;
  extraReducers?: any;
  error?: (error: Error) => void;
}

export type ExtractState<M extends ModelMap> = {
  [key in keyof M]: ReturnType<M[key]["state"]>;
};

export interface StoreCreator {
  <C extends Config>(config: C): Store<ExtractState<C["initialModel"]>>;
}

export const create: StoreCreator;
export * from "redux";
