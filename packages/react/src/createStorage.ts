import { GlobalStorage, SliceStorage } from './@types';
import { createDuraReducer } from './createDuraReducer';

export function createGlobalStorage(): GlobalStorage {
  const dura = createDuraReducer();
  return {
    reducers: {},
    effects: {},
    refCount: {},
    coreReducers: {
      D: dura,
    },
  };
}

export function createSliceStorage(): SliceStorage {
  return {
    reducers: {},
    effects: {},
  };
}
