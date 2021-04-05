import { Action } from 'redux';
import { produce } from 'immer';
import { set } from 'lodash-es';
import { ON_CHANGE_STATE } from './const';

export type CreateActionFn = (type: string, ...args: unknown[]) => never;

/**
 * 创建Action描述信息
 * @param type Action Type
 * @param args 参数信息，最终会以数组的形式注入进 Payload
 * @returns Action对象
 */
export const createAction: CreateActionFn = (type, ...args) =>
  ({
    type,
    payload: args,
  } as never);

export type ResolveHtmlInputValueFn = (
  eventType: string,
  event: React.ChangeEvent<HTMLInputElement>,
) => string | boolean;

/**
 * 获取 HtmlInput 的 value 值
 * @param eventType HtmlInput type 的取值 @see https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input
 * @param event HtmlInputEvent
 * @returns value值
 */
export const resolveHtmlInputValue: ResolveHtmlInputValueFn = (
  eventType,
  event,
) => {
  switch (eventType) {
    case 'text':
    case 'textarea':
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
      return event.target.value;
    case 'checkbox':
    case 'radio':
      return event.target.checked;
    default:
      throw new Error('error');
  }
};

export type Transform =
  | ((...args: unknown[]) => unknown)
  | string
  | number
  | undefined;

export type ResolveOnChangeFn = (
  transform: Transform,
  ...args: any[]
) => never | never[];

export const resolveOnChange: ResolveOnChangeFn = (transform, ...args) => {
  const event = args?.[0] as React.ChangeEvent<HTMLInputElement>;
  const eventType = event?.target?.type;

  /**
   * 优先判定 transform 按照指定的顺序来判断
   * 1:函数，那么直接调用函数进行转换操作
   * 2:字符，那么默认走 target type 的逻辑 , transform 将会当做 target type 处理
   * 3:数字，将会认为是调用时参数列表的第 N 个参数，默认从 0 开始
   *
   * transform 逻辑结束之后，将会对 e.target.type 进行判断
   *
   * 如以上都不满足，那么默认将会直接返回 args
   */
  if (typeof transform === 'function') {
    return transform(...args);
  } else if (typeof transform === 'string') {
    return resolveHtmlInputValue(transform, event);
  } else if (typeof transform === 'number') {
    return args[transform];
  } else if (typeof eventType === 'string') {
    return resolveHtmlInputValue(eventType, event);
  } else {
    return args;
  }
};

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
