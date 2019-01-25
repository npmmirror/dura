import { AnyAction, Store } from "redux";

declare interface IModel {
  state: object;
  reducers: object;
  effects: object;
}

interface IRootModel {
  [name: string]: IModel;
}

interface IReducer {
  [name: string]: () => any;
}

export interface IRootReducer {
  [name: string]: () => any;
}

export interface IPlugin {
  self?: any;
  onModel?: (model: IModel) => void;
  middleware?: (store: any) => any;
  onStoreCreated?: (store: any) => any;
  expandReducers?: () => any;
}

export interface IConfig {
  models: IRootModel;
  initialState?: object;
  middlewares?: Array<any>;
  plugins?: Array<IPlugin>;
}

export interface DuraStore extends Store<any, AnyAction> {
  models: (...models: Array<IModel>) => void;
}

export type DuraState<M extends IRootModel> = { [modelKey in keyof M]: M[modelKey]["state"] };
