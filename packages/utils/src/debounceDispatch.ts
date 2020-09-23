import type { DebounceSettings } from '@dura/types';

export function debounceDispatch(
  cache: Map<string, any>,
  type: string,
  debounceSettings: DebounceSettings,
  fn: () => any,
) {
  const debounceKey = `${type}/debounce`;
  const clearKey = `${debounceKey}/clear`;
  const has = cache.has(debounceKey);

  const delayClearFn = setTimeout(() => {
    cache.delete(debounceKey);
    cache.delete(clearKey);
  }, debounceSettings.wait);

  if (debounceSettings.iife && !has) {
    fn();
    cache.set(
      debounceKey,
      setTimeout(() => false, debounceSettings.wait),
    );
    cache.set(clearKey, delayClearFn);
    return;
  }

  const executor = setTimeout(fn, debounceSettings.wait);

  clearTimeout(cache.get(debounceKey));
  clearTimeout(cache.get(clearKey));
  cache.delete(debounceKey);
  cache.delete(clearKey);

  cache.set(debounceKey, executor);
  cache.set(clearKey, delayClearFn);
}
