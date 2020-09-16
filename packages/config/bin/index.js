#!/usr/bin/env node
// require("../lib/index");
const typescript = require("rollup-plugin-typescript2");
const { terser } = require("rollup-plugin-terser");
const progress = require("rollup-plugin-progress");
const commonjs = require("rollup-plugin-commonjs");

const rollup = require("rollup");
const Commander = require("commander");
const path = require("path");

console.log(process.cwd(), process.argv);

const getOutput = (dir, format) => ({
  file: `${process.cwd()}/${dir}/index.js`,
  format: format,
  name: "duraStat",
  sourcemap: true,

  globals: {
    redux: "redux",
    invariant: "invariant",
    immer: "immer",
    react: "react",
    "lodash.isplainobject": "lodash.isplainobject",
  },
});

const getInputOptions = () => ({
  input: `${process.cwd()}/src/index.ts`,
});

const getOutputOptions = () => ({
  output: [
    // getOutput("es", "esm"),
    getOutput("lib", "cjs"),
    // getOutput("umd", "umd"),
    // getOutput("amd", "amd"),
  ],
});

const config = {
  input: `${process.cwd()}/src/index.ts`,
  output: [
    // getOutput("es", "esm"),
    getOutput("lib1", "cjs"),
    // getOutput("umd", "umd"),
    // getOutput("amd", "amd"),
  ],
  plugins: [
    //   progress(),
    typescript(),
    commonjs(),
  ],
};

// rollup.rollup({ input: `${process.cwd()}/src/index.ts` });
const program = new Commander.Command();
program
  .version("1.0.0")
  .description("a build tools for dura!")
  .command("build", { isDefault: true })
  .option("-w , --watch ", "enable watch")
  .action(async function (dir, args, bb) {
    console.log("dir", dir, args, bb, program.opts());
    if (dir.watch) {
      const watcher = rollup.watch(config);
      watcher.on("event", function (event) {
        console.log(event.code);
      });
    } else {
      const bundle = await rollup.rollup({
        input: `${process.cwd()}/src/index.ts`,
        external: [
          "rollup-plugin-typescript2",
          "rollup-plugin-terser",
          "rollup-plugin-progress",
          "rollup-plugin-commonjs",
          "rollup",
          "commander",
        ],
        plugins: [
          typescript(),
          terser({
            module: format === "esm" ? true : false,
            toplevel: format === "cjs" ? true : false,
          }),
        ],
      });
      await bundle.generate(getOutput("lib1", "cjs"));
      await bundle.write(getOutput("lib1", "cjs"));
    }
  })
  .parse(process.argv);
