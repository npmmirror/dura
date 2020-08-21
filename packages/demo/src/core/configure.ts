import {
  StoreEnhancer,
  createStore,
  Action,
  combineReducers,
  Store,
  ReducersMapObject,
  Middleware,
  applyMiddleware,
  compose,
} from 'redux';
import invariant from 'invariant';
import { produceWithPatches } from 'immer';
import { defineHiddenProperty } from './defineHiddenProperty';
import { PATCHES_SYMBOL } from './Symbol';
import { createEffectMiddleware } from './effectMiddleware';
import { chain } from 'lodash';

interface Config {
  enhancers?: StoreEnhancer[];
  middlewares?: Middleware[];
  onError?: (error: Error) => void;
}

interface ReducerFun<S> {
  (state: S, action: Action<string>): void;
}

interface EffectParameter {
  getState: any;
  action: Action<string>;
}

interface EffectFun {
  (params: EffectParameter): void | Promise<void>;
}

interface Reducers<S> {
  [name: string]: ReducerFun<S>;
}

interface Effects {
  [name: string]: EffectFun;
}

interface Model<S> {
  namespace: string;
  state: S;
  reducers: Reducers<S>;
  effects: Effects;
}

interface duraCreateStore {
  <S>(models: Model<S>[], preloadedState?: S): void;
}

function wrapReducer(model) {
  return function (state, action) {
    const [, reducerName] = action.split('/');
    invariant(!reducerName, 'Inaccurate action type format!');
    const [nextState, patches] = produceWithPatches((draft) => {
      model?.reducers?.[reducerName](draft, action);
    })(state);
    const modifyFieldPath = patches.map(
      (n) => `${model.namespace}.${n.path.join('.')}`,
    );
    defineHiddenProperty(nextState, PATCHES_SYMBOL, modifyFieldPath);
    return nextState;
  };
}

// export function configure(config: Config): createStore;

export function configure(config: Config): duraCreateStore {
  return function <P>(models: Model<any>[], preloadedState?: P): any {
    let reducers: ReducersMapObject = {};
    let effects = {};
    let reduxStore: Store;

    function use(...models: Model<any>[]) {
      let index = -1;
      while (++index < models.length) {
        const model = models[index];
        invariant(!model?.namespace, 'model must exist namespace!');
        invariant(!(model.namespace in reducers), 'model already exists!');
        reducers[model.namespace] = wrapReducer(model);
      }
    }

    function unUse(...namespaceOfList: string[]) {
      invariant(!reduxStore, 'store has not been initialized!');
      let index = -1;
      while (++index < namespaceOfList.length) {
        const namespace = namespaceOfList[index];
        delete effects[namespace];
        delete reducers[namespace];
        reduxStore.replaceReducer(combineReducers(reducers));
      }
    }

    function getEffects(namespace: string, methodName: string) {
      return effects[namespace][methodName];
    }

    function run() {
      const effectMiddleware = createEffectMiddleware(getEffects);

      const middlewares = config?.middlewares ?? [];
      const enhancers = config?.enhancers ?? [];

      const enhancer = compose(
        applyMiddleware(effectMiddleware, ...middlewares),
        ...enhancers,
      );

      reduxStore = createStore(combineReducers(reducers), enhancer);
      return { ...reduxStore };
    }

    return {
      use,
      unUse,
      run,
    };
  };
}

configure({})([
  {
    namespace: <const>'xx',
    state: {
      name: 'xx',
    },
    reducers: {
      onc(state, action) {
        action.type;
      },
    },
    effects: {
      s({ getState }) {
        getState().name;
      },
    },
  },
]);

// type CombineUnion<T> = (T extends any ? (param: T) => any : never) extends (
//   param: infer P,
// ) => any
//   ? P
//   : never;

// type RequiredKeys<T> = {
//   [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
// }[keyof T];

// type M<N extends string, S = any> = { namespace: N; state: S };

// type Map2Obj<T> = T extends M<infer N, infer S>
//   ? {
//       [K in N]: {
//         [NK in RequiredKeys<S>]: S[NK];
//       };
//     }
//   : never;

// function f<N extends string, S, MA extends M<N, S>[]>(
//   ms: MA,
// ): CombineUnion<Map2Obj<MA[number]>>;

// function f(ms: any) {
//   return ms.reduce(
//     (prev: any, next: any) => ({ [next.namespace]: next.state, ...prev }),
//     {},
//   );
// }

// const res = f([
//   {
//     namespace: 'user',
//     state: { name: undefined, sex: '男', street: undefined },
//   },
//   { namespace: 'order', state: { id: 'xx', skuName: undefined } },
// ]);
