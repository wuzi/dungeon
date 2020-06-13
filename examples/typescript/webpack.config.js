const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.ts",
  context: path.resolve(__dirname, "src"),
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new HtmlWebpackPlugin({ template: "./index.html" })]
};
