import { Config, DuraStore } from "@dura/types";
/**
 * 创建store
 * @param config
 */
declare function create(config: Config): DuraStore;
export { create };
