import type { Store, Action } from 'redux';
import { STORAGE, CreateSliceOptions, ReducersMap } from './types';
export declare function createUseMount<
  S,
  A extends Action,
  M extends ReducersMap<S, A>
>(
  options: CreateSliceOptions<S, A, M>,
  store: Store,
  storage: STORAGE,
): () => void;
