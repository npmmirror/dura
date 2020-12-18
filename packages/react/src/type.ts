
export interface SliceReducersMapObject {
  [name: string]: Reducer;
}

export interface SliceRefCount {
  [name: string]: number;
}

export interface Action<P = any, M = any> {
  type: `${string}/${string}`;
  payload: P;
  meta: M;
}

export interface Reducer<S = any,P = any,M = any> {
  (state: S, action: Action<P,M>): void;
}
