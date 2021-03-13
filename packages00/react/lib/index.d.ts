import type { StoreEnhancer } from 'redux';
import { ReducersMap, Action, CreateSliceOptions, Return } from './types';
export declare function createDuraEnhancer(): StoreEnhancer<{
  createSlice: <S, A extends Action, M extends ReducersMap<S, A>>(
    options: CreateSliceOptions<S, A, M>,
  ) => Return<S, M>;
}>;
export * from './types';
export * from './useAsync';
