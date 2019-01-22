import { IPlugin, IModel } from "./typings";

function createEffectsPlugin(): IPlugin {
  return {
    self: {
      effects: {}
    },
    onModel(model: IModel) {},
    middleware(store) {
      return next => action => {
        if (typeof this.effects[action.type] === "function") {
          return this.effects[action.type]();
        } else {
          next(action);
        }
      };
    }
  };
}

export default createEffectsPlugin;
