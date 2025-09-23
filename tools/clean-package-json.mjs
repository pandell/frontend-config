// Script run during packaging (see package.json) to tidy up the package.json
// that is included with the released version.

/* global console */

import { readFileSync, writeFileSync } from "node:fs";

const packageJsonPath = "./package.json";
const packageJsonString = readFileSync(packageJsonPath, "utf8");
const packageJson = JSON.parse(packageJsonString);

delete packageJson.browserslist;
delete packageJson.devDependencies;
delete packageJson.scripts;

const newPackageJsonString = `${JSON.stringify(packageJson, null, 2)}\n`;
if (packageJsonString !== newPackageJsonString) {
  writeFileSync(packageJsonPath, newPackageJsonString, "utf8");
  console.log("Cleaned package.json"); // eslint-disable-line no-console
}
