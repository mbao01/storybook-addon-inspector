#!/usr/bin/env zx

import boxen from "boxen";
import chalk from "chalk";
import dedent from "dedent";
import { readFile } from "node:fs/promises";
import { globalPackages as globalManagerPackages } from "storybook/internal/manager/globals";
import { globalPackages as globalPreviewPackages } from "storybook/internal/preview/globals";

const packageJson = await readFile("./package.json", "utf8").then(JSON.parse);

const name = packageJson.name;
const displayName = packageJson.storybook.displayName;

let exitCode = 0;

/**
 * Check that meta data has been updated
 */
if (
  name.includes("addon-inspector") ||
  displayName.includes("Addon Inspector")
) {
  console.error(
    boxen(
      dedent`
      ${chalk.red.bold("Missing metadata")}

      ${chalk.red(dedent`Your package name and/or displayName includes default values from the Addon Kit.
      The addon gallery filters out all such addons.

      Please configure appropriate metadata before publishing your addon. For more info, see:
      https://storybook.js.org/docs/react/addons/addon-catalog#addon-metadata`)}`,
      { padding: 1, borderColor: "red" },
    ),
  );

  exitCode = 1;
}

/**
 * Check that globalized packages are not incorrectly listed as peer dependencies
 */
const peerDependencies = Object.keys(packageJson.peerDependencies || {});
const globalPackages = [...globalManagerPackages, ...globalPreviewPackages];
peerDependencies.forEach((dependency) => {
  if (globalPackages.includes(dependency)) {
    console.error(
      boxen(
        dedent`
          ${chalk.red.bold("Unnecessary peer dependency")}
  
          ${chalk.red(dedent`You have a peer dependency on ${chalk.bold(dependency)} which is most likely unnecessary
          as that is provided by Storybook directly.
          Check the "bundling" section in README.md for more information.
          If you are absolutely sure you are doing it correct, you should remove this check from scripts/prepublish-checks.js.`)}
        `,
        { padding: 1, borderColor: "red" },
      ),
    );

    exitCode = 1;
  }
});

process.exit(exitCode);
