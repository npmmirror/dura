import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { IConfig, IPlugin, DuraStore, IRootReducer } from "./typings";
import { handleActions } from "redux-actions";
import clone from "clone";

function extractReducers(name: string, model: IModel) {}

function create(config: IConfig) {
  const initialModel = config.models || {};

  Object.keys(initialModel).map((name: string) => initialModel[name]);
}

export default class Dura {
  /**
   * 全局配置
   */
  private config: IConfig;

  /**
   * 全局models
   */
  private rootReducer: IRootReducer;

  /**
   * 全局的插件
   */
  private gPlugins: Array<IPlugin> = [];

  private duraStore: DuraStore;

  constructor(config: IConfig) {
    this.config = config;
    this.gPlugins = [].concat(config.plugins);
    // config.models.forEach(this.addModel.bind(this));
  }

  private renameReducer(modelName: string, model: IModel) {
    const nextReducer = Object.keys(model.reducers).map((reducerKey: string) => ({
      [`${modelName}.${reducerKey}`]: model[reducerKey]
    }));
    return { [modelName]: handleActions(nextReducer, model.state) };
  }

  private extractReducers() {
    this.rootReducer = Object.keys(this.config.models)
      .map((modelName: string) => this.renameReducer(modelName, this.config.models[modelName]))
      .reduce((prev, next) => ({ ...prev, ...next }), {});
  }

  /**
   * 创建store
   */
  public createDuraStore(): DuraStore {
    this.extractReducers();

    // const effects = this.mergeEffects();

    // const effectsMiddlewares = store => next => action => {
    //   if (typeof effects[action.type] === "function") {
    //     effects[action.type]({
    //       rootState: clone(store.getState()),
    //       dispatch: store.dispatch,
    //       action: action
    //     });
    //   }
    //   return next(action);
    // };

    // const storeEnhancer = compose(applyMiddleware(effectsMiddlewares));

    // const reduxStore = createStore(this.mergeReducers(), this.config.initialState || {}, storeEnhancer);

    // this.duraStore = {
    //   ...reduxStore,
    //   models: (...models: Array<IModel>) => {
    //     models.forEach(this.addModel.bind(this));
    //     this.duraStore.replaceReducer(this.mergeReducers());
    //   }
    // };

    return this.duraStore;
  }
}
