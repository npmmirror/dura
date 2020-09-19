import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import progress from "rollup-plugin-progress";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default [
  {
    input: `${__dirname}/src/index.ts`,
    output: {
      file: `${__dirname}/lib/index.js`,
      format: "cjs",
      name: "duraStat",
      sourcemap: true,
      globals: {
        rollup: "rollup",
        commander: "commander",
        "rollup-plugin-terser": "rollup-plugin-terser",
        "rollup-plugin-typescript2": "rollup-plugin-typescript2",
        "rollup-plugin-progress": "rollup-plugin-progress",
        "rollup-plugin-notify": "rollup-plugin-notify",
        "@rollup/plugin-node-resolve": "@rollup/plugin-node-resolve",
      },
    },
    plugins: [
      terser(),
      progress(),
      typescript(),
      commonjs(),
      json(),
      nodeResolve(),
    ],
    external: [
      "rollup",
      "commander",
      "rollup-plugin-terser",
      "rollup-plugin-typescript2",
      "rollup-plugin-notify",
      "rollup-plugin-progress",
      "chalk",
      "module",
      "@rollup/plugin-node-resolve",
      "@rollup/plugin-commonjs",
      "@rollup/plugin-json",
    ],
  },
  {
    input: `${__dirname}/src/cli.ts`,
    output: {
      file: `${__dirname}/bin/index.js`,
      format: "cjs",
      name: "duraStat",
      banner: "#!/usr/bin/env node",
      globals: {
        rollup: "rollup",
        commander: "commander",
        "rollup-plugin-terser": "rollup-plugin-terser",
        "rollup-plugin-typescript2": "rollup-plugin-typescript2",
        "rollup-plugin-progress": "rollup-plugin-progress",
        "rollup-plugin-notify": "rollup-plugin-notify",
        "@rollup/plugin-node-resolve": "@rollup/plugin-node-resolve",
      },
    },
    plugins: [
      terser(),
      progress(),
      typescript(),
      commonjs(),
      json(),
      nodeResolve(),
    ],
    external: [
      "rollup",
      "commander",
      "rollup-plugin-terser",
      "rollup-plugin-typescript2",
      "rollup-plugin-notify",
      "rollup-plugin-progress",
      "chalk",
      "module",
      "@rollup/plugin-node-resolve",
      "@rollup/plugin-commonjs",
      "@rollup/plugin-json",
    ],
  },
];
