import { Plugin } from "@dura/plus";

export type immerPluginCreator = () => Plugin;

export const createImmerPlugin: immerPluginCreator;
