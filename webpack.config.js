const path = require("path");

const nodeExternals = require("webpack-node-externals");

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: "source-map",
  entry: "./trampo.ts",
  externals: [
    nodeExternals(),
  ],
  mode: "production",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        enforce: "pre",
        test: /\.ts$/,
        use: [
          {
            loader: "tslint-loader",
            options: {
              configFile: "./tslint.json",
              tsConfigFile: "./tsconfig.json",
              typeCheck: true,
              failOnHint: true,
              fix: true
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "trampo.js",
    path: path.resolve(__dirname, "bin"),
  },
  resolve: {
    extensions: [ ".ts", ".js" ],
  },
  target: "node",
};
