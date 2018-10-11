"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _babel = _interopRequireDefault(require("./babel.config"));

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DefinePlugin = _webpack.default.DefinePlugin;

function mapObjectValue(object, mapFn) {
  return Object.keys(object).map(mapFn).reduce(function (prev, next) {
    return _objectSpread({}, prev, next);
  }, {});
}

function getWebpackConfig(_ref) {
  var entry = _ref.entry,
      outDir = _ref.outDir,
      extensions = _ref.extensions,
      alias = _ref.alias,
      define = _ref.define;
  var babelConfig = (0, _babel.default)({});
  return {
    mode: 'production',
    stats: "errors-only",
    entry: _path.default.join(process.cwd(), entry),
    output: {
      filename: 'bundle-[hash:8].js',
      path: _path.default.join(process.cwd(), outDir)
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'].concat(_toConsumableArray(extensions)),
      alias: _objectSpread({}, {}, mapObjectValue(alias, function (key) {
        return _defineProperty({}, key, _path.default.join(process.cwd(), alias[key]));
      }))
    },
    module: {
      rules: [{
        test: /\.js|.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: babelConfig
        }
      }, {
        test: /\.ts|.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
          useCache: true,
          babelCore: "@babel/core",
          babelOptions: babelConfig
        }
      }]
    },
    plugins: [new DefinePlugin(_objectSpread({}, {}, mapObjectValue(define, function (key) {
      return _defineProperty({}, key, JSON.stringify(define[key]));
    })))]
  };
}

var _default = getWebpackConfig;
exports.default = _default;