import { Plugin } from '@dura/types';
import produce from 'immer';

export const createImmerPlugin = function(): Plugin {
  return {
    onReducer(modelName, reducerName, reducer) {
      return (baseState, payload, meta) =>
        produce(baseState, draftState => {
          return reducer(draftState, payload, meta);
        });
    }
  };
};
