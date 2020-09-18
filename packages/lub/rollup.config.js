import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import progress from "rollup-plugin-progress";

export default {
  input: `${__dirname}/src/index.ts`,
  output: {
    file: `${__dirname}/lib/index.js`,
    format: "cjs",
    name: "duraStat",
    sourcemap: false,
    banner: "#!/usr/bin/env node",
    globals: {
      rollup: "rollup",
      commander: "commander",
      "rollup-plugin-terser": "rollup-plugin-terser",
      "rollup-plugin-typescript2": "rollup-plugin-typescript2",
      "rollup-plugin-progress": "rollup-plugin-progress",
      "rollup-plugin-notify": "rollup-plugin-notify",
    },
  },
  plugins: [progress(), typescript(), terser()],
  external: [
    "rollup",
    "commander",
    "rollup-plugin-terser",
    "rollup-plugin-typescript2",
  ],
};
