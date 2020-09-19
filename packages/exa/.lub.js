import { defineRollupConfigura } from "@dura/lub";

export default defineRollupConfigura({
  input: "src/index.ts",
  name: "test",
  format: "es",
});
