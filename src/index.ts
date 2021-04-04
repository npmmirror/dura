import React from 'react';
import {
  StoreEnhancerStoreCreator,
  AnyAction,
  Action,
  Reducer,
  PreloadedState,
  createStore,
  compose,
  combineReducers,
} from 'redux';
import { setAutoFreeze } from 'immer';
import { createImmerReducer } from './internal';
import { createUseMount } from './createUseMount';
import { createUseState } from './createUseState';
import { createUseOnChange } from './createUseOnChange';
import { reducerHandle } from './reducerHandle';
import { createUseSelector } from './createUseSelector';
import { DefineLeafFn, AnyFunction } from './types';

setAutoFreeze(false);

export interface UseOptions<T extends AnyFunction> {
  transform: T;
}

export function createDura() {
  /**
   * 用来缓存所有 slice reducer
   */
  const _SLICE_REDUCERS: Record<string, any> = {};

  function duraEnhancerStoreCreator(
    createStore: StoreEnhancerStoreCreator<
      Record<string, any>,
      Record<string, any>
    >,
  ): StoreEnhancerStoreCreator<{ defineLeaf: DefineLeafFn }> {
    function _createStore<
      S = Record<string, any>,
      A extends Action = AnyAction
    >(reducer: Reducer<S, A>, preloadedState?: PreloadedState<S>) {
      /**
       * 创建 redux-store
       */
      const reduxStore = createStore(reducer, preloadedState);

      const defineLeaf: DefineLeafFn = (options) => {
        const { namespace, initialState, reducers = {} } = options;
        function createContext($namespace: string) {
          return {
            has() {
              return !!_SLICE_REDUCERS[$namespace];
            },
            del() {
              delete _SLICE_REDUCERS[$namespace];
            },
            add() {
              _SLICE_REDUCERS[$namespace] = createImmerReducer(
                $namespace,
                initialState,
                reducers,
              );
            },
            refresh() {
              reduxStore.replaceReducer(
                compose(reducer, combineReducers(_SLICE_REDUCERS)),
              );
            },
          };
        }
        const context = createContext(namespace);

        const useMount = createUseMount(context);
        const useState = createUseState(namespace, reduxStore as never);
        const useOnChange = createUseOnChange(namespace, reduxStore as never);
        const useSelector = createUseSelector(namespace, reduxStore as never);
        const use = reducerHandle(namespace, reduxStore as never, reducers);

        return {
          ...use,
          useMount,
          useState,
          useOnChange,
          useSelector,
        } as never;
      };

      return {
        ...reduxStore,
        defineLeaf,
      } as never;
    }
    return _createStore;
  }
  return duraEnhancerStoreCreator;
}

const _ = createDura();

const res = createStore((state = {}) => state, compose(_));

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
