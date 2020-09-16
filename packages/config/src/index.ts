import rollup, { Plugin, WarningHandlerWithDefault } from "rollup";
import { program } from "commander";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const configOfUser = require(`${process.cwd()}/lub.config.js`);

const format = "cjs";
const outDir = "test";

const defaultPlugins = [typescript(), terser()];

const defaultInput = `${process.cwd()}/src/index.ts`;

const getInputOptions = () => ({
  input: `${process.cwd()}/src/index.ts`,
  plugins: [typescript(), terser()],
});

const getOutput = (dir, format) => ({
  file: `${process.cwd()}/${dir}/index.js`,
  format: format,
  name: "duraStat",
  sourcemap: true,
  external: [],
  globals: {},
});

const config = {
  ...getInputOptions(),
  output: [getOutput("lib", "cjs")],
};

async function build() {
  const bundle = await rollup.rollup(getInputOptions());
  await bundle.generate(getOutput(outDir, format));
  await bundle.write(getOutput(outDir, format));
}

async function watch() {
  const watcher = rollup.watch(config);
  watcher.on("event", function (event) {
    console.log("watcher-->", event.code);
  });
}

program
  .version(
    require("../package.json").version,
    "-v, --version",
    "output the current version"
  )
  .description("a build tools for dura!")
  .command(" build", " build js lib ", { isDefault: true })
  .option("-w --watch", "enable watch")
  .action(function (dir) {
    if (dir.watch) {
      watch();
    } else {
      build();
    }
  })
  .parse(process.argv);

export interface Configura {
  input?: string;
  external?: string[];
  plugins?: Plugin[];
  onwarn?: WarningHandlerWithDefault;
}

function defineRollup(config) {}
