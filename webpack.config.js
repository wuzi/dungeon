const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    dungeon: "./src/index.js",
    "dungeon.min": "./src/index.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: "Dungeon",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      sourceMap: "none"
    })
  ]
};
