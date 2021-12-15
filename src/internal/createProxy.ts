import { defineHiddenConstantProperty } from './defineHiddenConstantProperty';
import isPlainObject from 'lodash.isplainobject';
export const SNAKE_SYMBOL = Symbol('@@SNAKE_SYMBOL');

function caclPath(parentPath: unknown, property: unknown) {
  return parentPath ? `${parentPath}.${property}` : `${property}`;
}

export function createProxy<T extends object>(
  state: T,
  deps: Map<string, number>,
  parentPath?: string,
): T {
  const proxy = new Proxy(state, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      // const value = target[property];
      // console.log(property);

      // 如果是 symbol 类型 则直接返回
      if (typeof property === 'symbol') {
        return value;
      }

      const path = caclPath(parentPath, property);

      if (isPlainObject(value) || Array.isArray(value)) {
        defineHiddenConstantProperty(value, SNAKE_SYMBOL, 1);
        return createProxy(value, deps, path);
      }

      const count = deps.get(path) + 1;
      if (isNaN(count)) {
        deps.set(path, 1);
      } else {
        deps.set(path, count);
      }

      return value;
    },
  });
  return proxy;
}
