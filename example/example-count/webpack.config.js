const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const tsImportPluginFactory = require("ts-import-plugin");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@components": path.resolve(__dirname, "components"),
      "@models": path.resolve(__dirname, "models"),
      "@store": path.resolve(__dirname, "src/store.ts")
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [tsImportPluginFactory({ style: true }), createStyledComponentsTransformer()]
          }),
          compilerOptions: {
            module: "es2015"
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "My App",
      template: "./public/index.html"
    }),
    new webpack.HotModuleReplacementPlugin({})
  ],
  devServer: {
    hot: true,
    open: "Google Chrome",
    contentBase: path.join(__dirname, "dist")
  }
};
