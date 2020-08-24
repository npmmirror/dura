declare const $CombinedState: unique symbol;

interface Model<S, A> {
  namespace: string;
  state: S;
  reducers: {
    [$CombinedState]: import("redux").Reducer<S, A>;
  };
}
