import rollup from "rollup";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import { program } from "commander";
const Module = require("module");
const notify = require("rollup-plugin-notify");
const progress = require("rollup-plugin-progress");

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
];

const input = `${process.cwd()}/src/index.ts`;

const output = `${process.cwd()}/lib/index.js`;

const format = "cjs";

async function getConfig() {
  const bundle = await rollup.rollup({
    input: `${base}/.lub.js`,
  });
  const {
    output: [{ code }],
  } = await bundle.generate({
    exports: "named",
    format: "cjs",
  });
  const myModule = new Module("cfg");

  myModule._compile(code, "cfg");

  return myModule.exports.default;
}

async function build() {
  const config = await getConfig();
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
    if (event.code === "ERROR") {
      console.error(event.error);
    }
  });
}

program
  .version(require("../package.json").version)
  .command("build", { isDefault: true })
  .option("-w , --watch", "watch build")
  .action(function (arg) {
    if (arg.watch) {
      watch();
    } else {
      build();
    }
  })
  .parse(process.argv);
