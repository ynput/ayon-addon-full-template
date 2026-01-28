import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { federation } from "@module-federation/vite";
import path from "path";

import { dependencies } from "./package.json";

export default ({ mode }: { mode: string }) => {
  Object.assign(process?.env, loadEnv(mode, process?.cwd(), ""));

  const SERVER_URL = process?.env?.SERVER_URL || "http://localhost:5000";

  return defineConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: SERVER_URL,
          changeOrigin: true,
        },
        "/ws": {
          target: SERVER_URL,
          changeOrigin: true,
          ws: true,
        },
        "/addons": {
          target: SERVER_URL,
          changeOrigin: false,
        },
        "/graphql": {
          target: SERVER_URL,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      federation({
        filename: "remoteEntry.js",
        name: "comments",
        exposes: {
          "./CommentsProject": "./src/Remotes/CommentsProjectRemote.tsx",
          "./CommentsStudio": "./src/Remotes/CommentsStudioRemote.tsx",
        },
        remotes: {},
        shared: {
          react: {
            requiredVersion: dependencies.react,
            singleton: true,
          },
          "react-dom": {
            requiredVersion: dependencies["react-dom"],
            singleton: true,
          },
          "styled-components": {
            requiredVersion: dependencies["styled-components"],
            singleton: true,
          },
          "@ynput/ayon-react-components": {
            requiredVersion: dependencies["@ynput/ayon-react-components"],
            singleton: true,
          },
        },
      }),
    ],
    build: {
      target: "chrome89",
      outDir: path.resolve(__dirname, "./dist/modules/comments"),
      emptyOutDir: true,
      cssCodeSplit: false,
      minify: true,
    },
    base: "",
  });
};
