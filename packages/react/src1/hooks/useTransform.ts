import { usePersistFn } from './usePersistFn';
import { compose } from 'redux';
export interface UseTransformOptions<T = undefined> {
  transformArgs: T;
}

export const useTransform = <T extends (...args: any[]) => any>(
  fn: T,
  options?: UseTransformOptions<T>,
) => {
  return usePersistFn(
    options?.transformArgs ? compose(fn, options?.transformArgs) : fn,
  );
};
