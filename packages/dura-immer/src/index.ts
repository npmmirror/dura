import produce from "immer";

export const createImmerPlugin = function () {
  return {
    wrapModel: (name, model) => {
      const convert = ([k, v]) => ({
        [k]: (state, payload, meta) =>
          produce(state, (draftState) => v(draftState, payload, meta)),
      });

      const reducers = () =>
        Object.entries(model?.reducers?.() ?? {})
          .map(convert)
          .reduce((prev, next) => ({ ...prev, ...next }), {});

      return {
        ...model,
        reducers,
      };
    },
  };
};
