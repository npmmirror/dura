import type { Action } from 'redux';
import { CreateSliceOptions, ReducersMap } from './types';
export declare function createImmerReducer<
  S,
  A extends Action,
  M extends ReducersMap<S, A>
>(options: CreateSliceOptions<S, A, M>): (state: {}, action: any) => {};
