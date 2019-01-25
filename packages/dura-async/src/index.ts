import { IPlugin, IModel } from "dura-core";

function createAsyncEffects(): IPlugin {
  return {
    self: {
      gEffects: {}
    },
    onModel(model: IModel) {
      this.gEffects = Object.keys(model.effects)
        .map(key => ({ [`${model.name}.${key}`]: model.effects[key] }))
        .reduce((prev, next) => ({ ...prev, ...next }), {});
    },
    middleware(store) {
      return next => action => {
        if (typeof this.gEffects[action.type] === "function") {
          const param = {
            dispatch: store.dispatch,
            rootState: store.getState(),
            action: action
          };
          return this.gEffects[action.type](param);
        }
        return next(action);
      };
    }
  };
}

export default createAsyncEffects;
