import copyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
// @ts-expect-error not typed
import replaceInFileWebpackPlugin from "replace-in-file-webpack-plugin";
import { Configuration } from "webpack";
import packageJson from "./package.json";

export const webConfig: Configuration = {
  target: "web",
  mode: "none",
  entry: "./src/web/vscode-mock.ts",
  output: {
    path: path.resolve(__dirname, "./dist-web"),
    filename: "vscode-mock.js",
    library: {
      name: "codeJumperGameVScodeMock",
      type: "global",
    },
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/web/index.html"),
          to: path.resolve(__dirname, "./dist-web/index.html"),
        },
        {
          from: path.resolve(__dirname, "./src/web/override.css"),
          to: path.resolve(__dirname, "./dist-web/override.css"),
        },
        {
          from: path.resolve(__dirname, "./resources/icon.png"),
          to: path.resolve(__dirname, "./dist-web/favicon.png"),
        },
        {
          from: path.resolve(__dirname, "./media"),
          to: path.resolve(__dirname, "./dist-web"),
          toType: "dir",
        },
      ],
    }),
    new replaceInFileWebpackPlugin([
      {
        dir: "./dist-web",
        files: ["index.html"],
        rules: [
          {
            search: "VERSION",
            replace: packageJson.version,
          },
        ],
      },
    ]),
  ],
};

export default webConfig;
