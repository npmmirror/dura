import { AnyAction, Store } from "redux";

export interface IModel {
  name: string;
  state: object;
  reducers: object;
}

export interface IPlugin {
  self?: any;
  onModel?: (model: IModel) => void;
  middleware?: (store: any) => any;
  onStoreCreated?: (store: any) => any;
  expandReducers?: () => any;
}

export interface IConfig {
  models: Array<IModel>;
  initialState?: object;
  middlewares?: Array<any>;
  plugins?: Array<IPlugin>;
}

export interface DuraStore extends Store<any, AnyAction> {
  models: (...models: Array<IModel>) => void;
}
