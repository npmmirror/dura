import { Action, AnyAction } from 'redux';

import { usePersistFn } from '@onecocjs/use';
import { Context } from '../types';
import { ON_CHANGE_STATE } from '../const';

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
export interface UseBindOptions<T extends (...args: unknown[]) => unknown> {
  transform?: T | string | number;
}

export function createUseOnChange<
  S extends Record<string, any>,
  A extends Action = AnyAction
>({ namespace, reduxStore }: Context<S, A>) {
  return function useOnChange<T extends (...args: any[]) => any>(
    path: string,
    options: UseBindOptions<T>,
  ) {
    return usePersistFn((...args: unknown[]) => {
      const value = resolveOnChange(options?.transform, ...args);
      const action = {
        type: `${namespace}/${ON_CHANGE_STATE}`,
        payload: [path, value],
      };
      reduxStore.dispatch(action as never);
    });
  };
}
