const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/JS/index.js",
  output: {
    path: path.resolve(__dirname, "./src/JS"),
    filename: "bundle.js",
  },
  watch: true,
};
