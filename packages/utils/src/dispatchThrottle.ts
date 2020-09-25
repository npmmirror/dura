import type { ThrottleSettings } from '@dura/types';

export function dispatchThrottle(
  cache: Map<string, any>,
  type: string,
  throttleSettings: number | ThrottleSettings,
  fn: () => any,
) {
  const throttleKey = `${type}/throttle`;
  const clearKey = `${throttleKey}/clear`;
  const has = cache.has(throttleKey);

  if (has) {
    return;
  }

  const wait =
    typeof throttleSettings === 'number'
      ? throttleSettings
      : throttleSettings.wait;

  const iife =
    typeof throttleSettings === 'number'
      ? false
      : throttleSettings.iife ?? false;

  const timerId = setTimeout(() => {
    cache.delete(throttleKey);
    cache.delete(clearKey);
  }, wait);

  if (iife && !has) {
    fn();
    cache.set(
      throttleKey,
      setTimeout(() => false, wait),
    );
    cache.set(clearKey, timerId);
    return;
  }

  const executor = setTimeout(fn, wait);

  clearTimeout(cache.get(throttleKey));
  clearTimeout(cache.get(clearKey));
  cache.delete(throttleKey);
  cache.delete(clearKey);

  cache.set(throttleKey, executor);
  cache.set(clearKey, timerId);
}
