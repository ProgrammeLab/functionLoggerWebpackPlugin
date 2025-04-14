const path = require("path");
const LogFunctionCallsPlugin = require("../dist/index");

module.exports = {
  entry: path.resolve(__dirname, "index.js"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new LogFunctionCallsPlugin()],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};
