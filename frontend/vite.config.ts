import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { federation } from "@module-federation/vite";
import { existsSync, readFileSync } from "fs";
import path from "path";

import { dependencies } from "./package.json";

// Inside AYON the host provides these, so the addon uses the host's Redux store, api cache and
// React contexts (GlobalContext, ProjectContext, ...) instead of its own copies.
// Every entry of @ynput/ayon-frontend-shared is shared: an entry left out would bring its own
// copy of the api and contexts with it.
const sharedPackageDir = path.resolve(
  __dirname,
  "node_modules/@ynput/ayon-frontend-shared",
);
const sharedPackage = JSON.parse(
  readFileSync(path.join(sharedPackageDir, "package.json"), "utf8"),
);
const ayonShared = Object.fromEntries(
  Object.entries(sharedPackage.exports as Record<string, { import: string }>)
    // skip entries the published package lists but doesn't ship
    .filter(([, entry]) => existsSync(path.join(sharedPackageDir, entry.import)))
    .map(([subpath]) => [
      path.posix.join("@ynput/ayon-frontend-shared", subpath),
      {
        requiredVersion: dependencies["@ynput/ayon-frontend-shared"],
        singleton: true,
      },
    ]),
);

// @ynput/ayon-addon is always AYON's own copy: import: false bundles no copy into the addon, so
// it can't end up with a second registry (or a stale, linked one).
const addonApiVersion = JSON.parse(
  readFileSync(
    path.resolve(__dirname, "node_modules/@ynput/ayon-addon/package.json"),
    "utf8",
  ),
).version;

export default ({ mode, command }: { mode: string; command: string }) => {
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
        // AYON loads the modules at runtime, it needs no federation type declarations
        dts: false,
        exposes: {
          // contributions to AYON's slots, see src/manifest.ts
          "./manifest": "./src/manifest.ts",
        },
        remotes: {},
        // use what AYON already loaded (its store, api and contexts), even when this addon was
        // built against a newer version
        shareStrategy: "loaded-first",
        // Only the build runs inside AYON. The dev server runs on its own: nothing to share with,
        // and vite pre-bundles these like any other dependency.
        shared: command !== "build" ? {} : {
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
          "@reduxjs/toolkit": {
            requiredVersion: dependencies["@reduxjs/toolkit"],
            singleton: true,
          },
          "react-redux": {
            requiredVersion: dependencies["react-redux"],
            singleton: true,
          },
          ...ayonShared,
          "@ynput/ayon-addon": {
            import: false,
            requiredVersion: `^${addonApiVersion}`,
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
