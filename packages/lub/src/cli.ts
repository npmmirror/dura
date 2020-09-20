import rollup from "rollup";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { program } from "commander";
import json from "@rollup/plugin-json";
import notify from "rollup-plugin-notify";
import progress from "rollup-plugin-progress";
import chalk from "chalk";

const Module = require("module");

const base = process.cwd();

const defaults = {
  compilerOptions: {
    moduleResolution: "Node",
    target: "ES5",
    esModuleInterop: true,
    jsx: "react",
    sourceMap: true,
    noEmitOnError: true,
    allowSyntheticDefaultImports: true,
    declaration: true,
    declarationDir: "lib",
  },
  include: [`${base}/src`],
  exclude: [`${base}/node_modules`, `${base}/__tests__`],
};
const override = {};

const plugins = [
  terser(),
  progress(),
  typescript({
    tsconfigDefaults: defaults,
  }),
  notify({
    success: true,
  }),
  json(),
  nodeResolve(),
  commonjs(),
];

const input = `${process.cwd()}/src/index.ts`;

const output = `${process.cwd()}/lib/index.js`;

const format = "esm";

async function getConfig() {
  const bundle = await rollup.rollup({
    input: `${base}/.lub.js`,
    plugins: [json(), nodeResolve(), commonjs()],
  });

  const {
    output: [{ code }],
  } = await bundle.generate({
    format: "cjs",
    exports: "named",
  });

  const cfgModule = new Module("cfg");

  cfgModule._compile(code, "cfg");

  return cfgModule.exports.default;
}

async function build() {
  const config = await getConfig();
  console.log(chalk.green("start all file bundle construction"));
  const inputOptions = {
    input: config?.input ?? input,
    external: config?.external ?? [],
    plugins: [...plugins, ...(config?.plugins ?? [])],
  };

  const outputOptions = {
    file: config?.file ?? output,
    format: config?.format ?? format,
    name: config?.name,
    globals: config?.globals,
    exports: config?.exports,
  };

  const bundle = await rollup.rollup(inputOptions);

  await bundle.generate(outputOptions);

  await bundle.write(outputOptions);

  console.log(chalk.green("complete all file bundle construction"));
}

async function watch() {
  const config = await getConfig();
  const outputOptions = {
    file: config?.file ?? output,
    format: config?.format ?? format,
    name: config?.name,
    globals: config?.globals,
    exports: config?.exports,
  };

  const watchOptions = {
    input: config?.input ?? input,
    external: config?.external ?? [],
    plugins: [...plugins, ...(config?.plugins ?? [])],
    output: [outputOptions],
  };
  const watcher = rollup.watch(watchOptions);
  watcher.on("event", function (event) {
    if (event.code === "START") {
      console.log(chalk.green("the listener is starting (restarting)  "));
    } else if (event.code === "BUNDLE_START") {
      console.log(chalk.green("build a single file bundle"));
    } else if (event.code === "BUNDLE_END") {
      console.log(chalk.green("complete file bundle construction"));
    } else if (event.code === "END") {
      console.log(chalk.green("complete all file bundle construction"));
    } else if (event.code === "ERROR") {
      console.log(
        chalk.red(`encountered an error while building:${event.error}`)
      );
    }
  });
}

program
  .command("build", { isDefault: true })
  .option("-w , --watch", "watch build")
  .action(function (arg) {
    if (arg.watch) {
      watch();
    } else {
      build();
    }
  })
  .version(
    require("../package.json").version,
    "-v, --version",
    "output the current version"
  )
  .parse(process.argv);
