import { Dispatch, Store, AnyAction, DeepPartial } from "redux";

export type Payload = {
  [name: string]: any;
};

export type Meta = {
  [name: string]: any;
};

export type DuraAction<P extends Payload = any, M extends Meta = any> = {
  type: string;
  payload?: P;
  meta?: M;
  error?: boolean;
};

export type DuraStore<RootState = any, ActionRunner = any> = Store<RootState> & {
  dispatch: Dispatch;
  actionRunner: ActionRunner;
};

export type Reducers<S = any> = {
  [name: string]: (payload?: Payload, meta?: Meta) => (state: S) => S;
};

export type Effect<RootState> = (request: EffectAPI<RootState>) => void;

export type Effects<RootState = any> = {
  [name: string]: (payload?: Payload, meta?: Meta) => Effect<RootState>;
};

export type Select<RootState = any, R = any> = (state: RootState) => R;

export type EffectAPI<RootState = any> = {
  dispatch: Dispatch;
  getState: () => RootState;
  delay: (ms: number) => Promise<{}>;
};

export type State = {
  [name: string]: number | string | object | undefined | null;
};

export interface Model<ModelState = any, RootState = any> {
  state: State;
  reducers?: Reducers<ModelState>;
  effects?: Effects<RootState>;
}

export interface RootModel {
  [name: string]: Model;
}

type EffectIntercept = {
  pre: (action: DuraAction) => boolean;
  before: (action: DuraAction, dispatch: Dispatch) => void;
  after: (action: DuraAction, dispatch: Dispatch) => void;
};

export type Plugin<S = any> = {
  name: string;
  model?: Model<S>;
  wrapModel?: (name:string,model: Model<any>) => Model<any>;
  intercept?: EffectIntercept;
};

export type Config = {
  initialModel?: RootModel;
  initialState?: any;
  plugins?: Array<Plugin<any>>;
};

export type ExtractRootState<M extends RootModel> = { [key in keyof M]: M[key]["state"] };

export type ExtractRootActionRunner<M extends RootModel> = ExtractReducersActionRunner<M> & ExtractEffectsActionRunner<M>;

export type ExtractReducersActionRunner<M extends RootModel> = { [key in keyof M]: M[key]["reducers"] };

export type ExtractEffectsActionRunner<M extends RootModel> = { [key in keyof M]: M[key]["effects"] };
