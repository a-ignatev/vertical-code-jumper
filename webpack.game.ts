import path from "path";
import { Configuration } from "webpack";

export const gameConfig: Configuration = {
  target: "web",
  mode: "none",
  entry: "./src/game/main.ts",
  output: {
    path: path.resolve(__dirname, "./media"),
    filename: "game.js",
    library: {
      name: "codeJumperGame",
      type: "global",
    },
  },
  resolve: {
    extensions: [".ts"],
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
    ],
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
};

export default gameConfig;
