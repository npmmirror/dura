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
import { merge, upperFirst, isArray } from 'lodash-es';
import { usePersistFn } from './usePersistFn';
import { resolveOnChange, createImmerReducer, createAction } from './internal';
import { createUseMount } from './createUseMount';
import { createUseState } from './createUseState';
import { createUseOnChange } from './createUseOnChange';

setAutoFreeze(false);

export type IsPrimitiveFn = (value: string) => boolean;

export type CreateActionFn = (type: string, ...args: unknown[]) => never;

export type ConvertNamespaceFn = (id?: string | number) => string;

export interface Id {
  id?: string | number;
}

export interface PlainObject {
  [name: string]: any;
}

export interface ReducerMapOfSlice {
  [name: string]: any;
}

export interface OptionsCreateSlice<N extends string, S> {
  namespace: N;
  initialState: S;
  reducers?: ReducerMapOfSlice;
}

export interface UseStateOptions {
  selector?: (...args: any) => any;
}

export interface UseBindOptions<T extends (...args: unknown[]) => unknown> {
  transform?: T | string | number;
}
export type ReducerBase<S> = Record<
  string,
  (state: S, ...args: never[]) => any
>;

export type ShiftAction<T extends any[]> = ((...args: T) => any) extends (
  arg1: any,
  ...rest: infer R
) => any
  ? R
  : never;

export type AnyFunction = (...args: any[]) => any;
export interface UseOptions<T extends AnyFunction> {
  transform: T;
}

export type UseFunction = <T extends AnyFunction>(
  options: UseOptions<T>,
) => T extends AnyFunction ? (...args: Parameters<T>) => void : never;

type PathKeys<T> = object extends T
  ? string
  : T extends readonly any[]
  ? Extract<keyof T, `${number}`> | SubKeys<T, Extract<keyof T, `${number}`>>
  : T extends object
  ? Extract<keyof T, string> | SubKeys<T, Extract<keyof T, string>>
  : never;
type SubKeys<T, K extends string> = K extends keyof T
  ? `${K}.${PathKeys<T[K]>}`
  : never;
type PropType<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<T[K], R>
    : unknown
  : unknown;

export type CreateSliceFn = <S, R extends ReducerBase<S>>(options: {
  namespace: string;
  initialState: S;
  reducers?: R;
}) => {
  [K in keyof R & string as `use${Capitalize<K>}`]: UseFunction;
} &
  {
    [K in keyof R]: (...args: ShiftAction<Parameters<R[K]>>) => void;
  } & {
    useMount: () => void;
    useState: () => S;
    useOnChange: (
      path: PathKeys<S>,
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  };

export function createDura() {
  /**
   * 用来缓存所有 slice reducer
   */
  const _SLICE_REDUCERS: ReducerMapOfSlice = {};

  function duraEnhancerStoreCreator(
    createStore: StoreEnhancerStoreCreator<PlainObject, PlainObject>,
  ): StoreEnhancerStoreCreator<{ createSlice: CreateSliceFn }> {
    function _createStore<S = PlainObject, A extends Action = AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>,
    ) {
      /**
       * 创建 redux-store
       */
      const reduxStore = createStore(reducer, preloadedState);

      function createSlice<N extends string, S>(
        optionsCreateSlice: OptionsCreateSlice<N, S>,
      ) {
        const { namespace, initialState, reducers = {} } = optionsCreateSlice;

        function operator($namespace: string) {
          return {
            has() {
              return _SLICE_REDUCERS[$namespace];
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

        const useMount = createUseMount(operator(namespace));
        const useState = createUseState(namespace, reduxStore as never);
        const useOnChange = createUseOnChange(namespace, reduxStore as never);

        const mapToUse = (name: string) => {
          function use<T extends (...args: any[]) => any>(
            optionsUse?: UseOptions<T>,
          ) {
            // const $namespace = resolveNamespace(namespace, id);
            const type = `${namespace}/${name}`;
            const fn = usePersistFn(
              (
                ...args: [React.ChangeEvent<HTMLInputElement>, ...unknown[]]
              ) => {
                const value = resolveOnChange(optionsUse?.transform, ...args);
                if (isArray(value)) {
                  reduxStore.dispatch(createAction(type, ...value));
                } else {
                  reduxStore.dispatch(createAction(type, value));
                }
              },
            );
            return fn;
          }

          return {
            [`use${upperFirst(name)}`]: use,
            [name]: function (...args: unknown[]) {
              const type = `${namespace}/${name}`;
              reduxStore.dispatch(createAction(type, ...args));
            },
          };
        };

        const use = Object.keys(reducers).map(mapToUse).reduce(merge);

        return { ...use, useMount, useState, useOnChange } as never;
      }

      return {
        ...reduxStore,
        createSlice,
      } as never;
    }
    return _createStore;
  }
  return duraEnhancerStoreCreator;
}

const _ = createDura();

const res = createStore((state = {}) => state, compose(_));

res.createSlice;

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
