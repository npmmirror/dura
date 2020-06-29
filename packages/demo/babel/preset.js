export default () => ({
  presets: [["@babel/preset-env", { debug: true }]],
  plugins: [["@babel/plugin-transform-typescript", {}]],
});
