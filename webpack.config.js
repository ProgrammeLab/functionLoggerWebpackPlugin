const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "index.js"),
  optimization: {
    usedExports: false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "commonjs",
    },
  },
};
