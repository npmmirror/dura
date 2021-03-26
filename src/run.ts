import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {
  StoreEnhancerStoreCreator,
  AnyAction,
  Reducer,
  PreloadedState,
  createStore,
  compose,
  combineReducers,
} from 'redux';
import { setAutoFreeze, produce } from 'immer';
import { get, merge, set, upperFirst, isPlainObject } from 'lodash-es';
import { useUpdate } from './useUpdate';
import { useMemoized } from './useMemoized';
import { createProxy } from './createProxy';
import { usePersistFn } from './usePersistFn';
setAutoFreeze(false);

export interface Id {
  id?: string | number;
}

export interface PlainObject {
  [name: string]: any;
}

export interface FluxAction<P = undefined, M = undefined> extends AnyAction {
  payload?: P;
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

export interface UseMountOptions extends Id {}

export interface UseStateOptions extends Id {
  selector?: (...args: any) => any;
}

export interface UseOptions<T extends (...args: any[]) => any> extends Id {
  transform?: T;
}

export interface UseBindOptions<T extends (...args: any[]) => any> extends Id {
  transform?: T | 'html';
}

export function createDura() {
  /**
   * 用来缓存所有 slice reducer
   */
  const _SLICE_REDUCERS: ReducerMapOfSlice = {};

  function duraEnhancerStoreCreator(
    createStore: StoreEnhancerStoreCreator<PlainObject, PlainObject>,
  ): StoreEnhancerStoreCreator<{ createSlice: unknown }> {
    function _createStore<S = PlainObject, A extends FluxAction = FluxAction>(
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

        //TODO
        const resolveOnChange = (transform: unknown, ...args: unknown[]) => {
          if (typeof transform === 'number') {
            return args[transform];
          } else if (typeof transform === 'function') {
            return transform(...args);
          } else {
            const [first] = args;
            // if (['text'].includes(first?.target?.type)) {
            // }
          }
        };

        /**
         * 转换 namespace
         */
        function convertNamespace(id?: string | number) {
          return [namespace, id].filter((x) => !!x).join('.');
        }

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
        function createImmerReducer($namespace: string) {
          return function immerReducer(
            state = initialState,
            action: FluxAction<{ key?: string; val?: string }>,
          ) {
            const [_namespace, $name] = action?.type?.split('/');
            if (_namespace !== $namespace) {
              return state;
            }
            return produce(state, (draft: never) => {
              if ($name === '@@SET_STATE') {
                set(draft, action?.payload?.key as never, action?.payload?.val);
              }
              reducers[$name]?.(draft, action);
            });
          };
        }

        /**
         * 挂载节点
         */
        function useMount(optionsUseMount?: UseMountOptions) {
          const $namespace = convertNamespace(optionsUseMount?.id);

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
            _SLICE_REDUCERS[$namespace] = createImmerReducer($namespace);
            refreshRedux();
          }
          useLayoutEffect(() => ref.current, [ref]);
        }

        /**
         * 获取状态信息
         */
        function useState(optionsUseState: UseStateOptions) {
          const update = useUpdate();
          const $namespace = convertNamespace(optionsUseState?.id);

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
            });
          }, [reduxStore.subscribe, $namespace]);
          return refProxy.current;
        }

        /**
         * 绑定数据
         */
        function useSetState<T extends (...args: any[]) => any>(
          path: string,
          optionsUseBind: UseBindOptions<T>,
        ) {
          const $namespace = convertNamespace(optionsUseBind?.id);
          return usePersistFn((...args) => {
            const [first] = args;
            const $transform = optionsUseBind?.transform ?? 'html';
            let val;

            // TODO
            if ($transform === 'html') {
              switch (first?.target?.type) {
                case 'text':
                case 'date':
                case 'datetime-local':
                case 'email':
                case 'month':
                case 'number':
                case 'password':
                case 'range':
                case 'search':
                case 'tel':
                case 'time':
                case 'url':
                case 'week':
                case 'datetime':
                  val = first.target.value;
                  break;
                case 'checkbox':
                case 'radio':
                  val = first.target.checked;
                  break;
                default:
                  if (isPlainObject(first)) {
                    val = first;
                  } else {
                    throw new Error(
                      'The value of useSetState must be a PlainObject',
                    );
                  }
              }
            } else if (typeof $transform === 'number') {
              val = args[$transform];
            } else if (typeof $transform === 'function') {
              val = $transform?.(...args);
            } else if (isPlainObject(first)) {
              val = first;
            } else {
              throw new Error('The value of useSetState must be a PlainObject');
            }
            const action = {
              type: `${$namespace}/@@SET_STATE`,
              payload: {
                key: path,
                val,
              },
            };
            reduxStore.dispatch(action as never);
          });
        }

        const use = Object.keys(reducers)
          .map((name) => {
            function createAction($namespace: string, payload: unknown) {
              return {
                type: `${$namespace}/${name}`,
                payload,
              } as never;
            }

            return {
              [`use${upperFirst(name)}`]: function use<
                T extends (...args: any[]) => any
              >(optionsUse?: UseOptions<T>) {
                const $namespace = convertNamespace(optionsUse?.id);
                const fn = usePersistFn((payload: unknown) => {
                  reduxStore.dispatch(createAction($namespace, payload));
                });
                const transformFn = compose(fn, optionsUse?.transform as any);
                return optionsUse?.transform ? transformFn : fn;
              },
            };
          })
          .reduce(merge);

        return { ...use, useMount, useState, useSetState } as never;
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

// type ReducerBase<S> = Record<string, (state:S,action:Action<never,never>) => any>;

// type ActionPick<A extends Action,F extends keyof A> = Pick<A,F>[F]

// declare function f<
//  S,
//  R extends ReducerBase<S>
// >(params:{ namespace: string,state:S,reducers:R }): {
//  [K in keyof R & string as `use${Capitalize<K>}`]: (payload:ActionPick<Parameters<R[K]>[1],"payload">,meta:ActionPick<Parameters<R[K]>[1],"meta">) => void
// }

// const r1 = f({
//  namespace: 'sss',
//  state: { name: '' },
//  reducers: {
//    changeName: (state,action:Action<{name:string}>) => {

//    }
//  },
// })

// r1.useChangeName({name:""},undefined);

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

// let make = getProp(obj, "cars.0.age");
