import { Config, Store, PluginMap, ExtractPluginState } from "@dura/types";
declare const create: <C extends Config, P extends PluginMap>(
  config: C,
  pluginMap?: P
) => Store<C["initialModel"] & ExtractPluginState<P>>;
export { create };
