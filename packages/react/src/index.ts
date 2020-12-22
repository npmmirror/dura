import {
  createStore as reduxCreateStore,
  combineReducers,
  compose,
  applyMiddleware,
  AnyAction,
} from 'redux';
import { createDefineReducer } from './createDefineReducer';
import { createDefineEffect } from './createDefineEffect';
import { createUseMount } from './createUseMount';
import { createUseSliceStore } from './createUseSliceStore';
import { createAsyncMiddleware } from './middleware';
import { createGlobalStorage, createSliceStorage } from './createStorage';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: 'dura4.x-draft',
        trace: true,
      })
    : compose;

function configura() {
  const globalStorage = createGlobalStorage();
  const middleware = createAsyncMiddleware(globalStorage);

  return function createStore() {
    const store = reduxCreateStore(
      combineReducers<any>({
        ...globalStorage.reducers,
        ...globalStorage.coreReducers,
      }),
      composeEnhancers(applyMiddleware(middleware)),
    );

    function createSlice<S>(name: string, initialState: S) {
      globalStorage.effects[name] = {};
      const sliceStorage = createSliceStorage();
      const defineReducers = createDefineReducer<S>(name, store, sliceStorage);
      const defineSideEffect = createDefineEffect(name, store, sliceStorage);
      const useMount = createUseMount(
        name,
        initialState,
        store,
        sliceStorage,
        globalStorage,
      );

      const useSliceStore = createUseSliceStore<S>(name, store);

      return {
        defineReducers,
        defineSideEffect,
        useMount,
        useSliceStore,
        getState: (): S => store.getState()[name],
      };
    }

    return { createSlice, store };
  };
}

export { configura };
export * from './@types';
export * from './transform';
