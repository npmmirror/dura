import type {
  StoreEnhancerStoreCreator,
  AnyAction,
  Action,
  Reducer,
  PreloadedState,
} from 'redux';
import { createSliceCreator } from './createSliceCreator';
import type { CreateSlice } from './types';

export function create(options: any) {
  // 缓存
  const reducersCache = {
    DURA: (state = {}) => state,
  } as { [name: string]: any };
  return function storeEnhancerStoreCreator(
    _createStore: StoreEnhancerStoreCreator,
  ): StoreEnhancerStoreCreator<{ createSlice: CreateSlice }> {
    return function createStore<S = any, A extends Action = AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>,
    ) {
      const reduxStore = _createStore(reducer, preloadedState);

      const createSlice = createSliceCreator(
        reducersCache,
        reduxStore as any,
        reducer,
      );

      return { ...reduxStore, createSlice };
    };
  };
}
