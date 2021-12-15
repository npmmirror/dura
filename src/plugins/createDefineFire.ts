import { Api } from '../types';
import ts from 'ts-toolbelt';
export const createDefineFire = (api: Api) => (fn: ts.F.Function) => async (
  ...args: unknown[]
) => {
  try {
    await fn(api.setState, api.getState)(...args);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      api.configureOptions.onError(error);
      throw error;
    }
    if (!api.configureOptions.onError) {
      throw error;
    }
    api.configureOptions.onError(error);
  }
};
