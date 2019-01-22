import Dura from "./dura";
import { IConfig } from "./typings";

export default function(config: IConfig) {
  return new Dura(config).createDuraStore();
}


export * from './typings'