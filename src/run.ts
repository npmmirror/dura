import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
import { setAutoFreeze, produce } from 'immer';
import {
  get,
  merge,
  set,
  upperFirst,
  isPlainObject,
  isArray,
  every,
} from 'lodash-es';
import { useUpdate } from './useUpdate';
import { useMemoized } from './useMemoized';
import { createProxy } from './createProxy';
import { usePersistFn } from './usePersistFn';
import { resolveOnChange, createImmerReducer } from './internal';

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

export interface FluxAction<P = undefined, M = undefined> extends AnyAction {
  payload: P[];
  meta?: M;
}

export type ImmerReducer = <S extends unknown, A extends FluxAction>(
  state: S,
  action?: A,
) => void;

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

export interface UseOptions<T extends (...args: any[]) => any> extends Id {
  transform?: T;
}

export interface UseBindOptions<T extends (...args: unknown[]) => unknown> {
  transform?: T | string | number;
}

export function createDura() {
  /**
   * 用来缓存所有 slice reducer
   */
  const _SLICE_REDUCERS: ReducerMapOfSlice = {};

  function duraEnhancerStoreCreator(
    createStore: StoreEnhancerStoreCreator<PlainObject, PlainObject>,
  ): StoreEnhancerStoreCreator<{ createSlice: unknown }> {
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

        const createAction: CreateActionFn = (type, ...args) =>
          ({
            type,
            payload: args,
          } as never);

        const isPrimitive: IsPrimitiveFn = (value) =>
          ['bigint', 'boolean', 'number', 'string', 'undefined'].includes(
            value,
          );

        /**
         * 转换 namespace
         */
        const convertNamespace: ConvertNamespaceFn = (id?: string | number) =>
          [namespace, id].filter((x) => !!x).join('.');

        /**
         * 刷新 redux 数据
         */
        function refreshRedux() {
          reduxStore.replaceReducer(
            compose(reducer, combineReducers(_SLICE_REDUCERS)),
          );
        }

        /**
         * 创建 使用immer 构建的 reducer
         */
        // function createImmerReducer($namespace: string) {
        //   return function immerReducer(
        //     state = initialState,
        //     action: FluxAction<{ key: string[]; val?: string }>,
        //   ) {
        //     const [_namespace, $name] = action?.type?.split('/');

        //     if (
        //       _namespace !== $namespace &&
        //       // TODO 广播模式 等待优化
        //       !$namespace.startsWith(_namespace)
        //     ) {
        //       return state;
        //     }
        //     return produce(state, (draft: never) => {
        //       if ($name === '@@CHANGE_STATE') {
        //         const [key, val] = action.payload;
        //         set(draft, key as never, val);
        //       }
        //       reducers[$name]?.(draft, ...action.payload);
        //     });
        //   };
        // }

        function id(id?: string | number) {
          const $namespace = convertNamespace(id);

          /**
           * 挂载节点
           */
          function useMount() {
            /** 卸载 */
            const ref = useRef<(() => void) | undefined>(undefined);
            ref.current = function unmount() {
              if (_SLICE_REDUCERS[$namespace]) {
                delete _SLICE_REDUCERS[$namespace];
                refreshRedux();
              }
            };

            /** 挂载 */
            if (!_SLICE_REDUCERS[$namespace]) {
              _SLICE_REDUCERS[$namespace] = createImmerReducer(
                $namespace,
                initialState,
                reducers,
              );
              refreshRedux();
            }
            useLayoutEffect(() => ref.current, [ref]);
          }

          /**
           * 获取状态信息
           */
          function useState(optionsUseState: UseStateOptions) {
            const update = useUpdate();

            /** 经过immer代理的对象 */
            const refProxy = useRef<unknown>(undefined);
            /** 原始对象信息 */
            const refOri = useRef<unknown>(undefined);
            /** 依赖信息 */
            const refDeps = useMemoized(() => new Map<string, unknown>());

            function recording() {
              /** 获取当前节点的 redux 数据 */
              const sliceState = reduxStore.getState()[$namespace];
              /** 清空过时的依赖缓存 */
              refDeps.clear();
              /** 每次都缓存一下最新的redux数据 */
              refOri.current = sliceState;
              /** 创建 proxy 代理对象 */
              refProxy.current = createProxy(sliceState, refDeps);
            }

            // TODO 这里注意一下，有可能需要 优化至 仅仅首次才 recording 一次
            recording();

            useEffect(() => {
              /** 监听 redux 的所有数据变化 */
              return reduxStore.subscribe(() => {
                const currentSliceState = reduxStore.getState()[$namespace];
                const keysIterator = refDeps.keys();
                let _ = keysIterator.next();
                let isUpdate = false;
                /** 循环对比变更 */
                while (!_.done) {
                  if (
                    get(currentSliceState, _.value) !==
                    get(refOri.current, _.value)
                  ) {
                    isUpdate = true;
                    break;
                  } else {
                    _ = keysIterator.next();
                  }
                }
                /** 如果存在变更数据 */
                if (isUpdate) {
                  recording(), update();
                }
                // update();
              });
            }, [reduxStore.subscribe, $namespace]);
            return refProxy.current;
          }

          /**
           * 绑定数据
           */
          function useChange<T extends (...args: any[]) => any>(
            path: string,
            optionsUseBind: UseBindOptions<T>,
          ) {
            return usePersistFn(
              (
                ...args: [React.ChangeEvent<HTMLInputElement>, ...unknown[]]
              ) => {
                const value = resolveOnChange(
                  optionsUseBind?.transform,
                  ...args,
                );
                const action = {
                  type: `${$namespace}/@@CHANGE_STATE`,
                  payload: [path, value],
                  meta: {
                    broadcasting: {},
                  },
                };
                reduxStore.dispatch(action as never);
              },
            );
          }

          const mapToUse = (name: string) => {
            function use<T extends (...args: any[]) => any>(
              optionsUse?: UseOptions<T>,
            ) {
              const $namespace = convertNamespace(optionsUse?.id);
              const type = `${$namespace}/${name}`;
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

          return {
            useMount,
            useState,
            useChange,
            ...use,
          };
        }

        return { id, ...id() } as never;
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
