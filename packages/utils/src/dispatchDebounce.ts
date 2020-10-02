import type { DebounceSettings } from '@dura/types';
import debounce from 'lodash.debounce';

export function dispatchDebounce(
  cache: Map<string, any>,
  type: string,
  debounceSettings: number | DebounceSettings,
  fn: any,
) {
  const debounceKey = `${type}/debounce`;
  const clearKey = `${debounceKey}/clear`;
  const has = cache.has(debounceKey);

  const wait =
    typeof debounceSettings === 'number'
      ? debounceSettings
      : debounceSettings.wait;

  const debounceFn =
    typeof debounceSettings === 'number'
      ? debounce(fn, debounceSettings)
      : debounce(fn, debounceSettings.wait, debounceSettings);

  function resetClearTime() {
    cache.get(clearKey) && clearTimeout(cache.get(clearKey));
    const timeId = setTimeout(() => {
      cache.delete(debounceKey);
      cache.delete(clearKey);
    }, wait + 10);
    cache.set(clearKey, timeId);
  }

  if (has) {
    resetClearTime();
    return cache.get(debounceKey);
  }

  cache.set(debounceKey, debounceFn);
  resetClearTime();

  return debounceFn;
}

// export function dispatchDebounce(
//   cache: Map<string, any>,
//   type: string,
//   debounceSettings: number | DebounceSettings,
//   fn: () => any,
// ) {
//   const debounceKey = `${type}/debounce`;
//   const clearKey = `${debounceKey}/clear`;
//   const has = cache.has(debounceKey);

//   const wait =
//     typeof debounceSettings === 'number'
//       ? debounceSettings
//       : debounceSettings.wait;

//   const iife =
//     typeof debounceSettings === 'number'
//       ? false
//       : debounceSettings.iife ?? false;

//   const timerId = setTimeout(() => {
//     cache.delete(debounceKey);
//     cache.delete(clearKey);
//   }, wait);

//   if (iife && !has) {
//     fn();
//     cache.set(
//       debounceKey,
//       setTimeout(() => false, wait),
//     );
//     cache.set(clearKey, timerId);
//     return;
//   }

//   const executor = setTimeout(fn, wait);

//   clearTimeout(cache.get(debounceKey));
//   clearTimeout(cache.get(clearKey));
//   cache.delete(debounceKey);
//   cache.delete(clearKey);

//   cache.set(debounceKey, executor);
//   cache.set(clearKey, timerId);
// }
