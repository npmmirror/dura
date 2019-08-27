export type Reducer<S = any, P = any, M = any> = (
  state: S,
  payload?: P,
  meta?: M
) => void;

export type Effect<P = any, M = any> = (payload?: P, meta?: M) => Promise<void>;

export interface ReducerMap {
  [name: string]: Reducer;
}

export interface EffectMap {
  [name: string]: Effect;
}

export type nameFunction = () => any;

export type stateFunction = () => any;

export type reducersFunction = () => {
  [name: string]: Reducer;
};

export type effectsFunction = () => {
  [name: string]: Effect;
};

export interface Model {
  name: nameFunction;
  state?: stateFunction;
  reducers?: reducersFunction;
  effects?: effectsFunction;
}

export interface Options {
  models: Model[];
}
