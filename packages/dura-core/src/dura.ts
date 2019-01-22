import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { IModel, IConfig, IPlugin, DuraStore } from "./typings";
import createReducersPlugin from "./reducersPlugin";
import { handleActions } from "redux-actions";

export default class Dura {
  /**
   * 全局配置
   */
  private config: IConfig;

  /**
   * 全局models
   */
  private gModels: Array<IModel> = [];

  /**
   * 全局的插件
   */
  private gPlugins: Array<IPlugin> = [];

  private duraStore: DuraStore;

  constructor(config: IConfig) {
    this.config = config;
    config.models.forEach(this.addModel.bind(this));
    this.gPlugins = [createReducersPlugin()].concat(config.plugins);
  }

  private extractReducer(model: IModel) {
    const nextReducer = Object.keys(model.reducers)
      .map((key: string) => ({ [`${model.name}.${key}`]: model.reducers[key] }))
      .reduce((prev, next) => ({ ...prev, ...next }), {});
    return { [model.name]: handleActions(nextReducer, model.state) };
  }

  private mergeReducers() {
    return combineReducers(
      this.gModels.map(this.extractReducer.bind(this)).reduce((prev, next) => ({ ...prev, ...next }), {})
    );
  }

  private addModel(model: IModel) {
    const exits = this.gModels.some((m: IModel) => m.name === model.name);
    if (exits) {
      throw new Error("[model.name] repeat definition!");
    }

    const onModelFns = this.gPlugins.filter(plugin => plugin.onModel).map(plugin => plugin.onModel);

    const recursive = (fns, model) => (fns.length === 0 ? model : recursive(fns, fns.shift()(model)));

    const nextModel = recursive(onModelFns, model);

    this.gModels.push(nextModel);
  }

  /**
   * 创建store
   */
  public createDuraStore(): DuraStore {
    const storeEnhancer = compose(applyMiddleware(...this.config.middlewares));

    const reduxStore = createStore(this.mergeReducers(), this.config.initialState || {}, storeEnhancer);

    this.duraStore = {
      ...reduxStore,
      models: (...models: Array<IModel>) => {
        models.forEach(this.addModel.bind(this));
        this.duraStore.replaceReducer(this.mergeReducers());
      }
    };

    return this.duraStore;
  }
}
