import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
  PreloadedState,
  ReducersMapObject,
  StoreEnhancer,
} from 'redux';
import { createDefineReducer } from './createDefineReducer';
import { createDefineEffect } from './createDefineEffect';
import { createUseMount } from './createUseMount';
import { createUseSliceStore } from './createUseSliceStore';
import { createAsyncMiddleware } from './middleware';
import { createGlobalStorage, createSliceStorage } from './createStorage';
import { Action } from './@types';
import { createCompose } from './createCompose';

function configura<S, A extends Action>(
  reducer: ReducersMapObject = {},
  preloadedState?: PreloadedState<any>,
  enhancer?: StoreEnhancer,
) {
  const globalStorage = createGlobalStorage();
  globalStorage.reducers = reducer;
  const middleware = createAsyncMiddleware(globalStorage);
  return function createStore() {
    const compose = createCompose('dura');
    let _enhancer;
    if (enhancer) {
      compose(enhancer, applyMiddleware(middleware));
    } else {
      _enhancer = compose(applyMiddleware(middleware));
    }
    const store = reduxCreateStore(
      combineReducers({
        ...globalStorage.reducers,
        ...globalStorage.coreReducers,
      }),
      preloadedState,
      _enhancer,
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
        store,
      };
    }

    return { createSlice, store };
  };
}

export { configura };
export * from './@types';
export * from './transform';
