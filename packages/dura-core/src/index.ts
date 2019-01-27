import { createStore, combineReducers, compose, applyMiddleware, Store, Dispatch, Action , bindActionCreators } from "redux";
import { handleActions, createActions, createAction } from "redux-actions";
import clone from "clone";

interface IReducers {
  [name: string]: (state: any, action: any) => any;
}

interface PayloadAction<P> extends Action {
  payload?: P;
}

interface DuraEffectRequest<P> {
  dispatch: Dispatch;
  getState: () => any;
  action: PayloadAction<P>;
}

interface IEffects {
  [name: string]: (params: DuraEffectRequest<any>) => void;
}

interface IState {
  [name: string]: any;
}

interface IModel {
  state: IState;
  reducers?: IReducers;
  effects?: IEffects;
}

interface IRootModel {
  [name: string]: IModel;
}

interface IMeta {
  loading: boolean;
}

interface IPlugin {
  self: object;
  name: () => string;
  addModel?: () => IModel;
  wrapModel?: (model: IModel, name: string) => IModel;
  isInterceptEffect?: (action: Action) => boolean;
  effectBefore?: (action: any) => void;
  effectAfter?: (action: any) => void;
}

interface IConfig {
  initialModel?: IRootModel;
  initialState?: any;
  plugins?: Array<IPlugin>;
}

function extractReducers(name: string, model: IModel) {
  const reducers = model.reducers || {};
  const reducerKeys = Object.keys(reducers);
  const nextReducer = reducerKeys
    .map((reducerName: string) => ({ [`${name}/${reducerName}`]: reducers[reducerName] }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return { [name]: handleActions(nextReducer, model.state) };
}

function extractEffects(name: string, model: IModel) {
  const effects = model.effects || {};
  const effectKeys = Object.keys(effects);
  const nextEffects = effectKeys
    .map((effectName: string) => ({ [`${name}/${effectName}`]: effects[effectName] }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return nextEffects;
}

function extractActionCreator(name: string, model: IModel, dispatch: Dispatch) {
  const { reducers = {}, effects = {} } = model;
  const reducerKeys = Object.keys(reducers);
  const effectKeys = Object.keys(effects);

  const action = reducerKeys
    .concat(effectKeys)
    .map((key: string) => ({
      [key]: (payload, meta) =>
        dispatch(createAction(`${name}/${key}`, payload => payload, (payload, meta) => meta)(payload, meta))
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return { [name]: action };
}

function createEffectsMiddleware(rootEffects, plugins: Array<IPlugin>) {
  return (store: Store) => next => action => {
    if (typeof rootEffects[action.type] === "function") {
      //前置拦截器
      plugins
        .filter(p => p.effectBefore)
        .filter(p => p.isInterceptEffect && p.isInterceptEffect.call(p.self, action))
        .forEach(p => p.effectBefore.call(p.self, action));
      //执行effect
      rootEffects[action.type]({
        dispatch: store.dispatch,
        getState: () => clone(store.getState()),
        action
      });
      //后置拦截器
      plugins
        .filter(p => p.effectAfter)
        .filter(p => p.isInterceptEffect && p.isInterceptEffect.call(p.self, action))
        .forEach(p => p.effectAfter.call(p.self, action));
    }
    return next(action);
  };
}

function onWrapModel(plugins: Array<IPlugin>, name: string, model: IModel) {
  if (plugins && plugins.length === 0) {
    return { [name]: model };
  }
  const firstPlugin = plugins.shift();
  const nextModel = firstPlugin.wrapModel.call(firstPlugin.self, model, name);
  return onWrapModel(plugins, name, nextModel);
}

function getPluginModel(plugins: Array<IPlugin>) {
  return plugins
    .map(({ name, self, addModel }: IPlugin) => ({ [name()]: addModel.call(self) }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
}

let actionCreator = undefined;

function create(config: IConfig) {
  const { initialModel = {}, initialState = {}, plugins = [] } = config;

  //追加插件model
  const pluginModel = getPluginModel(plugins.filter(p => p.addModel));

  //全部的model
  const allModel = { ...initialModel, ...pluginModel };

  const allModelKeys = Object.keys(allModel);

  //包装已有的model
  const warpModel = allModelKeys
    .map((name: string) => onWrapModel(plugins.filter(p => p.wrapModel), name, allModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  //聚合reducers
  const rootReducers = allModelKeys
    .map((name: string) => extractReducers(name, warpModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  //聚合effects
  const rootEffects = allModelKeys
    .map((name: string) => extractEffects(name, warpModel[name]))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  //创建effects的中间件
  const effectMiddleware = createEffectsMiddleware(rootEffects, plugins);

  //store增强器
  const storeEnhancer = compose(applyMiddleware(effectMiddleware));

  //创建redux-store
  const reduxStore = createStore(combineReducers(rootReducers), initialState, storeEnhancer);

  //聚合actions
  actionCreator = allModelKeys
    .map((name: string) => extractActionCreator(name, warpModel[name], reduxStore.dispatch))
    .reduce((prev, next) => ({ ...prev, ...next }), {});

  return reduxStore;
}

type DuraRootState<M extends IRootModel> = { [key in keyof M]: M[key]["state"] };

type DuraRootReducers<M extends IRootModel> = { [key in keyof M]: M[key]["reducers"] };

type DuraEffects<E extends IEffects> = { [key in keyof E]: (payload: any, meta?: IMeta) => E[key] };

type DuraRootEffects<M extends IRootModel> = { [key in keyof M]: DuraEffects<M[key]["effects"]> };

type DuraDispatch<M extends IRootModel> = DuraRootEffects<M> & DuraRootReducers<M>;

export { create, actionCreator, DuraRootState, DuraDispatch, DuraEffectRequest, IPlugin, IModel, IRootModel,DuraRootEffects };
