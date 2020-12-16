declare module '*.css';
declare module '*.less';
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (params: any) => any;
}

interface Reducer {
  <S>(state: S, action: import('redux').AnyAction): void;
}

interface SliceReducersMapObject {
  [name: string]: Reducer;
}

interface SliceRefCount {
  [name: string]: number;
}
