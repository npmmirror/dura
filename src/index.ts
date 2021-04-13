import {
  AnyAction,
  Action,
  Reducer,
  compose,
  combineReducers,
  StoreEnhancer,
} from 'redux';
import { produce, setAutoFreeze } from 'immer';
import { set } from 'lodash-es';
import { createUseMount } from './plugins/createUseMount';
import { createUseState } from './plugins/createUseState';
import { createUseSetter } from './plugins/createUseSetter';
import { reducerHandle } from './reducerHandle';
import { DefineLeafFn } from './types';
import { ON_CHANGE_STATE } from './const';

setAutoFreeze(false);

export interface FluxAction<P> extends Action<string> {
  payload: P;
}

export const createImmerReducer = (
  namespace: string,
  initialState: Record<string, any>,
  reducers: Record<string, Function>,
) => (
  state: Record<string, any> = initialState,
  action: FluxAction<[string, string]>,
) => {
  const [$namespace, $name] = action?.type?.split?.('/');
  if (
    // 如果不是当前模块
    $namespace !== namespace &&
    // 也不是广播模式
    !namespace.startsWith(`${$namespace}`)
  ) {
    return state;
  }
  return produce(state, (draft) => {
    if ($name === ON_CHANGE_STATE) {
      const [key, val] = action?.payload;
      return set(draft, key, val);
    }
    return reducers[$name]?.(draft, ...action.payload);
  });
};

export function createDura() {
  const _SLICE_REDUCERS: Record<string, any> = {};
  const enhancer: StoreEnhancer<{ defineLeaf: DefineLeafFn }> = (
    createStore,
  ) => <S, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: any,
  ) => {
    /**
     * 创建 redux-store
     */
    const reduxStore = createStore(reducer, preloadedState);

    const refresh = () =>
      void reduxStore.replaceReducer(
        compose(reducer, combineReducers(_SLICE_REDUCERS)),
      );

    const defineLeaf: DefineLeafFn = (options) => {
      const { namespace, initialState, reducers = {} } = options;
      const has = () => !!_SLICE_REDUCERS[namespace];
      const del = () => void delete _SLICE_REDUCERS[namespace];
      const add = () =>
        void (_SLICE_REDUCERS[namespace] = createImmerReducer(
          namespace,
          initialState,
          reducers,
        ));
      const context = {
        namespace,
        has,
        del,
        add,
        refresh,
        reduxStore,
      };

      const useMount = createUseMount(context);
      const useState = createUseState(context);
      const useSetter = createUseSetter(context);
      const use = reducerHandle(namespace, reduxStore as never, reducers);

      return {
        ...use,
        useMount,
        useState,
        useSetter,
      } as never;
    };

    return {
      ...reduxStore,
      defineLeaf,
    };
  };
  return enhancer;
}

// interface Action<P = undefined,M = undefined>{
//   type:string;
//   payload?:P,
//   meta?:M
// }

// type ReducerBase<S> = Record<string, (state:S,...args:never[]) => any>;

// type ActionPick<A extends Action,F extends keyof A> = Pick<A,F>[F]

// type ShiftAction<T extends any[]> = ((...args: T) => any) extends ((arg1: any, ...rest: infer R) => any) ? R : never;

// declare function f<
//  S,
//  R extends ReducerBase<S>
// >(params:{ namespace: string,state:S,reducers:R }): {
//  [K in keyof R & string as `use${Capitalize<K>}`]: (...args:ShiftAction<Parameters<R[K]>>) => void
// }
// type User = {
//   name:string,
//   age:number
// }
// const r1 = f({
//  namespace: 'sss',
//  state: { name: '' },
//  reducers: {
//    changeName: (state,name:string,age:number,user:User) => {

//    }
//  },
// })

// r1.useChangeName("",12,{name:"张三",age:12})

// type PathKeys<T> = object extends T
//   ? string
//   : T extends readonly any[]
//   ? Extract<keyof T, `${number}`> | SubKeys<T, Extract<keyof T, `${number}`>>
//   : T extends object
//   ? Extract<keyof T, string> | SubKeys<T, Extract<keyof T, string>>
//   : never;
// type SubKeys<T, K extends string> = K extends keyof T
//   ? `${K}.${PathKeys<T[K]>}`
//   : never;
// type PropType<T, Path extends string> = Path extends keyof T
//   ? T[Path]
//   : Path extends `${infer K}.${infer R}`
//   ? K extends keyof T
//     ? PropType<T[K], R>
//     : unknown
//   : unknown;

// declare function getProp<T, P extends PathKeys<T>>(
//   obj: T,
//   path: P,
// ): PropType<T, P>;

// const obj = {
//   name: 'John',
//   age: 42,
//   cars: [
//     { make: 'Ford', age: 10 },
//     { make: 'Trabant', age: 35 },
//   ],
// } as const;

// let make = getProp(obj, "cars.1.age");
