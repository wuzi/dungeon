/* eslint-env node */

const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const root = __dirname;

module.exports = function(env, argv) {
  const isDev = argv.mode === "development";

  return {
    context: path.join(root, "src"),
    entry: {
      dungeon: "./index.ts",
      "dungeon.min": "./index.ts"
    },
    output: {
      filename: "[name].js",
      path: path.join(root, "dist"),
      library: "Dungeon",
      libraryTarget: "umd",
      libraryExport: "default",
      globalObject: `typeof self !== 'undefined' ? self : this`
    },
    optimization: {
      minimizer: [new UglifyJsPlugin({ include: /\.min\.js$/, sourceMap: true })]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["env"]
            }
          }
        }
      ]
    },
    devtool: isDev ? "eval-source-map" : "source-map"
  };
};
