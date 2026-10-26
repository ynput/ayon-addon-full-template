// Copies a local ayon-frontend build of @ynput/ayon-frontend-shared into node_modules, to build
// and test the addon against unreleased shared changes.
//
//   yarn copy-shared ../../ayon-frontend
//
// Use this instead of `yarn link`. Module federation can't share a symlinked package with AYON,
// see "Testing with a local ayon-frontend" in the README. Run it again after each `yarn build:shared`
// in ayon-frontend, and run `yarn install --force` to go back to the published package.

import fs from "fs";
import path from "path";

const PACKAGE_NAME = "@ynput/ayon-frontend-shared";

const source = process.argv[2] || process.env.AYON_FRONTEND_DIR;
if (!source) {
  console.error(
    "Pass the path to your ayon-frontend checkout: yarn copy-shared <path>",
  );
  process.exit(1);
}

// accept the ayon-frontend checkout or its shared/ folder
const sharedDir = fs.existsSync(path.join(source, "shared", "package.json"))
  ? path.resolve(source, "shared")
  : path.resolve(source);

const packageJsonPath = path.join(sharedDir, "package.json");
const distDir = path.join(sharedDir, "dist");

if (!fs.existsSync(packageJsonPath)) {
  console.error(`No package.json in ${sharedDir}`);
  process.exit(1);
}

const { name, version } = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (name !== PACKAGE_NAME) {
  console.error(`${packageJsonPath} is ${name}, not ${PACKAGE_NAME}`);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  console.error(`No build in ${distDir}. Run "yarn build:shared" in ayon-frontend first.`);
  process.exit(1);
}

const target = path.resolve("node_modules", PACKAGE_NAME);

// also removes a `yarn link` symlink, without touching what it points to
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.copyFileSync(packageJsonPath, path.join(target, "package.json"));
fs.cpSync(distDir, path.join(target, "dist"), { recursive: true });

// the dev server would keep serving its pre-bundled copy of the old package
fs.rmSync(path.resolve("node_modules", ".vite"), { recursive: true, force: true });

console.log(`Copied ${PACKAGE_NAME} ${version} from ${sharedDir}`);
