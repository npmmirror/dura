import type { Store as ReduxStore } from 'redux';

export async function dispatchLoading<S>(
  reduxStore: ReduxStore<S>,
  type: string,
  loading: boolean | string | number,
  fn: () => any,
) {
  const dispatchTrue = (type: string) =>
    reduxStore.dispatch({
      type: 'DURA/CHANGE_LOADING',
      payload: {
        k: type,
        v: {
          status: true,
          error: undefined,
        },
      },
    });
  const dispatchFalse = (type: string) =>
    reduxStore.dispatch({
      type: 'DURA/CHANGE_LOADING',
      payload: {
        k: type,
        v: {
          status: false,
          error: undefined,
        },
      },
    });

  const dispatchError = (type: string, e: Error) =>
    reduxStore.dispatch({
      type: 'DURA/CHANGE_LOADING',
      payload: {
        k: type,
        v: {
          status: false,
          error: e,
        },
      },
    });

  const finallyTyoe =
    typeof loading === 'boolean' ? type : `${type}/${loading}`;

  try {
    dispatchTrue(finallyTyoe);
    await fn();
    dispatchFalse(finallyTyoe);
  } catch (error) {
    dispatchError(finallyTyoe, error);
  }
}
