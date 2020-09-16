import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import progress from "rollup-plugin-progress";

const getOutput = (dir, format) => ({
  file: `${__dirname}/${dir}/index.js`,
  format: format,
  name: "duraStat",
  sourcemap: true,
  globals: {
    isPlainObject: "lodash.isplainobject",
  },
});

export default {
  input: `${__dirname}/src/index.ts`,
  output: [getOutput("lib", "cjs")],
  plugins: [progress(), typescript(), terser()],
  external: ["lodash.isplainobject", "react"],
};
