import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import progress from "rollup-plugin-progress";

const getOutput = (dir, format) => ({
  file: `${__dirname}/${dir}/index.js`,
  format: format,
  name: "dura-async",
  sourcemap: true,
});

export default {
  input: `${__dirname}/src/index.ts`,
  output: [getOutput("lib", "cjs")],
  plugins: [
    progress(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    terser(),
  ],
};
