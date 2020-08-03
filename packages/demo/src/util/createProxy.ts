import { join } from 'lodash';
import isPlainObject from 'lodash.isplainobject';
import { DURA_SYMBOL } from './Symbol';
import { defineHiddenProperty } from './defineHiddenProperty';

export const createProxy = <T extends object>(
  state: T,
  deps: Map<string, number>,
  parentPath?: string,
): T =>
  new Proxy(state, {
    get(target: T, property: PropertyKey, receiver: T) {
      const value = Reflect.get(target, property, receiver);
      //如果不是我自身定义的属性，例如 map() 、 length 、 constructor 等等，则直接返回
      if (!target.hasOwnProperty(property)) {
        return value;
      }
      // 如果是 symbol 类型 则直接返回
      if (typeof property === 'symbol' || property === 'patches') {
        return value;
      }

      const joinPath = `${parentPath}.${property}`;
      const rootPath = `${property}`;

      if (isPlainObject(value) || Array.isArray(value)) {
        const path = parentPath ? joinPath : rootPath;
        defineHiddenProperty(value, DURA_SYMBOL, value);
        return createProxy(value, deps, path);
      }

      let count = (deps?.get?.(joinPath) ?? 0) + 1;
      deps.set(joinPath, count);

      return value;
    },
  });
