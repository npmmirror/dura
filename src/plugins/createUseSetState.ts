import { Api } from '../types';
import { usePersistFn } from '../internal/usePersistFn';
export function createUseSetState(api: Api) {
  return () => usePersistFn(api.setState);
}
