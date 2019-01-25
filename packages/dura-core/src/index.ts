import Dura from "./dura";
import { IConfig } from "./typings";
import { actions } from "./actions";

function create(config: IConfig) {
  return new Dura(config).createDuraStore();
}

export { create, actions };
