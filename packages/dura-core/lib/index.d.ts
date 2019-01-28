import { Config, DuraStore } from "./typing";
declare function create(config: Config): DuraStore<P, M>;
export * from "./typing";
export { create };
