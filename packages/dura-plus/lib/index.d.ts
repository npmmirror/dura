import { Config, Store, Plugin } from "@dura/types";
declare const create: <C extends Config, P extends Plugin>(config: C, plugins: P[]) => Store<C["initialModel"]>;
export { create };
