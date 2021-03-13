import { Action, Store } from 'redux';
import { STORAGE, ReducersMap, CreateSliceOptions, Return } from './types';
export declare function createSliceFactory(
  store: Store,
  storage: STORAGE,
): <S, A extends Action<any>, M extends ReducersMap<S, A>>(
  options: CreateSliceOptions<S, A, M>,
) => Return<S, M>;
