export declare function createStoreFactory(
  STORAGE: any,
): () => {
  createSlice: <
    S,
    A extends import('redux').Action<any>,
    M extends import('./types').ReducersMap<S, A>
  >(
    options: import('./types').CreateSliceOptions<S, A, M>,
  ) => import('./types').Return<M>;
};
