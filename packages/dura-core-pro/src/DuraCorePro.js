import { createDuraCore } from "dura-core";

const defaultOps = {
  initialModels: [],
  middleware: [],
  enhancers: [],
  plugins: []
};

export default function(ops = defaultOps) {
  const duraCorePro = {
    plugins: ops.plugins,
    initialModels: ops.initialModels,
    addModels: () => false,
    delModels: () => false,
    clear: () => false,
    destroy: () => false
  };

  const duraCore = createDuraCore({
    models: ops.initialModels
  });

  return { ...duraCorePro, ...duraCore };
}
