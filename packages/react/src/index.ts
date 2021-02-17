import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import { STORAGE } from './types';
import { createSliceFactory } from './createSliceFactory';

const $compose =
  typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
        name: 'dura',
        trace: true,
      })
    : compose;

export function configuration() {
  const storage: STORAGE = {
    current: {
      reducerMap: {
        D: (state = {}) => state,
      },
    },
  };
  return function createStore() {
    const reduxStore = reduxCreateStore(
      combineReducers(storage.current.reducerMap),
      $compose(applyMiddleware()),
    );
    const createSlice = createSliceFactory(reduxStore as any, storage);
    return {
      createSlice,
    };
  };
}
