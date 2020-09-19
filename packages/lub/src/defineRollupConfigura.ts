import type { Plugin, ModuleFormat, GlobalsOption } from "rollup";
export interface RollupConfigura {
  /** default src/index.ts */
  input?: string;
  external?: string[];
  plugins?: Plugin[];

  // only required for bundle.write
  file?: string;
  // default cjs
  format?: ModuleFormat;

  name?: string;

  globals?: GlobalsOption;

  exports?: "default" | "named" | "none" | "auto";
}

export function defineRollupConfigura(cfg: RollupConfigura): RollupConfigura {
  return cfg;
}
