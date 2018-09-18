const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
var HtmlWebpackPlugin = require("html-webpack-plugin");

const compiler = webpack({
  mode: "none",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 0.25%, not dead"
                }
              ]
            ],
            plugins: [
              "@babel/plugin-transform-react-jsx",
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: false,
                  helpers: false,
                  regenerator: true,
                  useESModules: false
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "public/index.html")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});

const server = new webpackDevServer(compiler, {
  hot: true,
  open: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: {
    colors: true
  }
});

server.listen(9999, "127.0.0.1", function() {});
