function defineRollup(arg) {
  return arg;
}

export default defineRollup({
  input: "src/index.ts",
  name: "test",
  format: "es",
});

export const a = 12;
