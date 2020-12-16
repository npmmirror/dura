import {
  createStore as reduxCreateStore,
  combineReducers,
  compose,
  ReducersMapObject,
  applyMiddleware,
  AnyAction,
  Dispatch,
  Store,
  Middleware,
} from 'redux';
import { createDefineReducer } from './createDefineReducer';
import { createUseMount } from './createUseMount';
import { createUseSliceStore } from './createUseSliceStore';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: 'dura4.x-draft',
        trace: true,
      })
    : compose;

function duraReducer(state = {}, action: AnyAction) {
  return state;
}

function configura() {
  let globalReducers: ReducersMapObject = {};
  let globalSideEffects: {
    [name: string]: { [name: string]: (...args: any[]) => any };
  } = {};
  let sliceRefCount: SliceRefCount = {};

  const middleware = ((store: Store) => (next: Dispatch<AnyAction>) => (
    action: AnyAction,
  ) => {
    const [namespace, methodName] = action.type.split('/');
    const effect = globalSideEffects[namespace][methodName];
    effect?.();
    return next(action);
  }) as Middleware;

  return function createStore() {
    const store = reduxCreateStore(
      combineReducers({
        D: duraReducer,
      }),
      composeEnhancers(applyMiddleware(middleware)),
    );

    function createSlice<S>(name: string, initialState: S) {
      globalSideEffects[name] = {};
      let sliceReducers: any = {};
      let sliceSideEffects: any = {};

      const defineReducers = createDefineReducer(name, store, sliceReducers);

      function defineSideEffect(fn: any) {
        sliceSideEffects[fn.name] = fn;
        return () => store.dispatch({ type: `${name}/${fn.name}` });
      }

      const useMount = createUseMount(
        name,
        initialState,
        store,
        sliceReducers,
        sliceSideEffects,
        globalReducers,
        globalSideEffects,
        sliceRefCount,
      );

      const useSliceStore = createUseSliceStore(name, store);

      return {
        defineReducers,
        defineSideEffect,
        useMount,
        useSliceStore,
        getState: () => (store.getState() as any)[name],
      };
    }

    return { createSlice, store };
  };
}

export { configura };
