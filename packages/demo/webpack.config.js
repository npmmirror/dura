const HtmlPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "none",
  output: {
    path: "/Users/ityuany/GitRepository/dura/packages/demo/dist",
    filename: "[name].bundle.js",
  },
  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js", ".json"] },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [new HtmlPlugin()],
  devServer: {
    port: 8888,
    open: true,
    hot: true,
    contentBase: "/Users/ityuany/GitRepository/dura/packages/demo/dist",
  },
  entry: "/Users/ityuany/GitRepository/dura/packages/demo/src/index.tsx",
};
