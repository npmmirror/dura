export function defineHiddenProperty<T, S extends symbol, V>(
  target: T,
  nameOfSymbol: S,
  value: V,
) {
  Object.defineProperty(target, nameOfSymbol, {
    value: value,
    writable: true,
  });
}
