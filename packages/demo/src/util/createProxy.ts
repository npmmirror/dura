export const createProxy = <T extends object>(
  state: T,
  deps: Map<string, null>,
  parentPath?: string
): T =>
  new Proxy(state, {
    get(target: T, property: PropertyKey, receiver: T) {
      const value = Reflect.get(target, property, receiver);
      //如果不是我自身定义的属性，例如 map() 、 length 、 constructor 等等，则直接返回
      if (!target.hasOwnProperty(property)) {
        return value;
      }
      // 如果是 symbol 类型 则直接返回
      if (typeof property === "symbol") {
        return value;
      }

      const joinPath = `${parentPath}.${property}`;
      const rootPath = `${property}`;

      if (isPlainObject(value) || Array.isArray(value)) {
        const path = parentPath ? joinPath : rootPath;
        return createProxy(value, deps, path);
      }

      if (!deps.has(joinPath)) {
        deps.set(joinPath, null);
      }

      return value;
    },
  });

function isPlainObject<T>(value: T): boolean {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
