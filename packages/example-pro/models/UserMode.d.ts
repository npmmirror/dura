export type OnChangeNameAction = {
  payload: {
    newName: string;
  };
};

export type OnAsyncChangeName = {
  payload: { newName: string };
  meta: { loading: boolean };
};
