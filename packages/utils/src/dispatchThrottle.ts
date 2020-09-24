import type { DebounceSettings } from '@dura/types';

export function dispatchThrottle(
  cache: Map<string, any>,
  type: string,
  debounceSettings: DebounceSettings,
  fn: () => any,
) {
  const throttleKey = `${type}/throttle`;
  const clearKey = `${throttleKey}/clear`;
  const has = cache.has(throttleKey);

  if (has) {
    return;
  }

  const timerId = setTimeout(() => {
    cache.delete(throttleKey);
    cache.delete(clearKey);
  }, debounceSettings.wait);

  if (debounceSettings.iife && !has) {
    fn();
    cache.set(
      throttleKey,
      setTimeout(() => false, debounceSettings.wait),
    );
    cache.set(clearKey, timerId);
    return;
  }

  const executor = setTimeout(fn, debounceSettings.wait);

  clearTimeout(cache.get(throttleKey));
  clearTimeout(cache.get(clearKey));
  cache.delete(throttleKey);
  cache.delete(clearKey);

  cache.set(throttleKey, executor);
  cache.set(clearKey, timerId);
}
