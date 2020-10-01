import type { ThrottleSettings } from '@dura/types';
import throttle from 'lodash.throttle';

export function dispatchThrottle(
  cache: Map<string, any>,
  type: string,
  throttleSettings: number | ThrottleSettings,
  fn: any,
) {
  const throttleKey = `${type}/throttle`;
  const clearKey = `${throttleKey}/clear`;
  const has = cache.has(throttleKey);

  const wait =
    typeof throttleSettings === 'number'
      ? throttleSettings
      : throttleSettings.wait;

  const throttleFn =
    typeof throttleSettings === 'number'
      ? throttle(fn, throttleSettings)
      : throttle(fn, throttleSettings.wait, throttleSettings);

  function resetClearTime() {
    cache.get(clearKey) && clearTimeout(cache.get(clearKey));
    const timeId = setTimeout(() => {
      cache.delete(throttleKey);
      cache.delete(clearKey);
    }, wait);
    cache.set(clearKey, timeId);
  }

  if (has) {
    resetClearTime();
    return cache.get(throttleKey);
  }

  cache.set(throttleKey, throttleFn);
  resetClearTime();

  return throttleFn;
}
