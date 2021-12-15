export function defineHiddenConstantProperty<T, S extends symbol | string, V>(
  target: T,
  name: S,
  value: V,
) {
  Object.defineProperty(target, name, {
    value: value,
    enumerable: false,
    writable: false,
    configurable: false,
  });
}
