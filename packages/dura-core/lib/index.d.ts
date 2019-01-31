import { Config, DuraStore, RootModel } from "@dura/types";
declare function create(config: Config): DuraStore;
declare function createActionCreator(models: RootModel): any;
export { create, createActionCreator };
