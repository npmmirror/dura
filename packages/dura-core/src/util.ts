export function delay(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function merge(prev, next) {
  return { ...prev, ...next };
}

export function noop() {
  return {};
}
