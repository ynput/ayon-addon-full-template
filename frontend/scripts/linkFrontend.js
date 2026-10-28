// Points frontend/.ayon-frontend at an ayon-frontend checkout, so the unpublished
// @ynput/ayon-addon and @ynput/ayon-addon-dev resolve from it (package.json links them as
// link:.ayon-frontend/addon and link:.ayon-frontend/addon-dev).
//
//   yarn link-frontend ../../ayon-frontend
//   yarn install
//
// Build the packages there first: `yarn build:addon` in ayon-frontend. A linked copy can't end up
// in the addon's bundle: the federation config lists @ynput/ayon-addon with import: false.

import fs from "fs";
import path from "path";

const source = process.argv[2] || process.env.AYON_FRONTEND_DIR;
if (!source) {
  console.error("Pass the path to your ayon-frontend checkout: yarn link-frontend <path>");
  process.exit(1);
}

const frontendDir = path.resolve(source);
for (const pkg of ["addon", "addon-dev"]) {
  if (!fs.existsSync(path.join(frontendDir, pkg, "package.json"))) {
    console.warn(`${frontendDir} has no ${pkg}/package.json (not an ayon-frontend with the addon SDK?)`);
  }
}

const link = path.resolve(".ayon-frontend");
const existing = fs.lstatSync(link, { throwIfNoEntry: false });
// a folder here is probably a checkout with work in it: move it aside, don't delete it
if (existing && !existing.isSymbolicLink()) {
  console.error(`${link} is a folder, not a link. Move it aside (mv .ayon-frontend .ayon-frontend.bak) and run this again.`);
  process.exit(1);
}
fs.rmSync(link, { force: true });
fs.symlinkSync(frontendDir, link, "dir");
console.log(`.ayon-frontend -> ${frontendDir}. Now run: yarn install`);
