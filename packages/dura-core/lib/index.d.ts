import { Dispatch } from "redux";
import { Config, DuraStore, RootModel } from "@dura/types";
declare function create(config: Config): DuraStore;
declare function createActionCreator(models: RootModel, dispatch: Dispatch): any;
export { create, createActionCreator };
