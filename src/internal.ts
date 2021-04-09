import { Action } from 'redux';
import { produce } from 'immer';
import { set, isArray } from 'lodash-es';
import { ON_CHANGE_STATE } from './const';

export type CreateActionFn = (type: string, ...args: unknown[]) => never;

/**
 * 创建Action描述信息
 * @param type Action Type
 * @param args 参数信息，最终会以数组的形式注入进 Payload
 * @returns Action对象
 */
export const createAction: CreateActionFn = (type, args) =>
  ({
    type,
    payload: isArray(args) ? args : [args],
  } as never);

export interface FluxAction<P> extends Action<string> {
  payload: P;
}

export type createImmerReducer = (
  namespace: string,
  initialState: Record<string, any>,
  reducers: Record<string, Function>,
) => (state: Record<string, any>, action: FluxAction<[string, string]>) => any;

export const createImmerReducer: createImmerReducer = (
  namespace,
  initialState,
  reducers,
) => (state = initialState, action) => {
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

export type ResolveNamespaceFn = (
  namespace: string,
  id?: string | number,
) => string;

export const resolveNamespace: ResolveNamespaceFn = (namespace, id) =>
  [namespace, id].filter((x) => !!x).join('.');
