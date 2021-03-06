const path = require("path");

const {BannerPlugin} = require("webpack")
const nodeExternals = require("webpack-node-externals");

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: "source-map",
  entry: "./trampo.ts",
  externals: [
    nodeExternals(),
  ],
  mode: "production",
  plugins: [
    new BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
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
      {
        loader: 'shebang-loader'
      }
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
