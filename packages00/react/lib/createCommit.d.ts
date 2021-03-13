import { Action, Store } from 'redux';
import { ReducersMap, CreateSliceOptions } from './types';
export declare function createCommit<
  S,
  A extends Action,
  M extends ReducersMap<S, A>
>(store: Store, options: CreateSliceOptions<S, A, M>): (fn: any) => void;
