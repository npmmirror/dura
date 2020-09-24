export function set<S, V>(target: S, path: string[], value: V) {
  const k = path.shift();

  if (path.length === 0) {
    target[k] = value;
    return;
  }

  if (target[k]) {
    set(target[k], path, value);
  } else {
    target[k] = {};
    set(target[k], path, value);
  }
}
