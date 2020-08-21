interface Store<S> {
  namespace: string;
  state: S;
  reducers: {
    [name: string]: (state: S, action?: any) => void;
  };
  effects: {
    [name: string]: (getState) => Promise<void>;
  };
}

export function defineStore<S>(store: Store<S>): Store<S>;

export function defineStore(store) {
  return store;
}
