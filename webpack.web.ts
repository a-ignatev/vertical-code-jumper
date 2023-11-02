import copyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";

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
          from: path.resolve(__dirname, "./media"),
          to: path.resolve(__dirname, "./dist-web"),
          toType: "dir",
        },
      ],
    }),
  ],
};

export default webConfig;
