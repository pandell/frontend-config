// spell-checker:words tses

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import esLintJs from "@eslint/js";
import type { TSESLint } from "@typescript-eslint/utils";
import esLintImportX from "eslint-plugin-import-x";
import esLintJsDoc from "eslint-plugin-jsdoc";
import esLintSimpleImportSort from "eslint-plugin-simple-import-sort";
import type { ConfigWithExtends } from "typescript-eslint";
import { config as esLintTsConfig, configs as esLintTsConfigs } from "typescript-eslint";

export type { TSESLint } from "@typescript-eslint/utils";
export {
  Config as EsLintTsConfig,
  config as esLintTsConfig,
  configs as esLintTsConfigs,
  ConfigWithExtends as EsLintTsConfigWithExtends,
  parser as esLintTsParser,
  plugin as esLintTsPlugin,
} from "typescript-eslint";

/**
 * Array of globs that match TypeScript files (including TSX) at any depth.
 */
export const typeScriptFileGlobs = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];

/**
 * As of 2024-06-05, "@eslint/js" recommended config does not include a name.
 * This config object adds a name.
 */
export const esLintConfigJsRecommended = {
  ...esLintJs.configs.recommended,
  name: "@eslint/js/recommended",
} satisfies ConfigWithExtends;

/**
 * As of 2024-06-04, "eslint-plugin-import-x" isn't fully flat-config
 * compatible, so adapt recommended config to the correct layout.
 */
export const esLintConfigImportXRecommended = {
  name: "eslint-plugin-import-x/recommended",
  plugins: { "import-x": esLintImportX },
  rules: esLintImportX.configs.recommended.rules,
} satisfies ConfigWithExtends;

/**
 * As of 2024-06-04, "eslint-plugin-import-x" isn't fully flat-config
 * compatible, so adapt TypeScript config as recommended in documentation
 * https://github.com/un-ts/eslint-plugin-import-x#typescript.
 */
export const esLintConfigImportXTypeScript = {
  ...esLintImportX.configs.typescript,
  name: "eslint-plugin-import-x/typescript",
  settings: {
    ...esLintImportX.configs.typescript.settings,
    "import-x/resolver": {
      typescript: true,
      node: true,
    },
  },
} satisfies ConfigWithExtends;

/**
 * As of 2024-06-04, "eslint-plugin-jsdoc" config does not include a name.
 * This config object adds a name.
 */
export const esLintConfigJsDocRecommended = {
  ...esLintJsDoc.configs["flat/recommended"],
  name: "eslint-plugin-jsdoc/recommended",
} satisfies ConfigWithExtends;

/**
 * As of 2024-06-04, "eslint-plugin-simple-import-sort" isn't fully flat-config
 * compatible, so adapt the plugin to the correct layout.
 */
export const esLintConfigSimpleImportSort = {
  name: "eslint-plugin-simple-import-sort/base",
  plugins: { "simple-import-sort": esLintSimpleImportSort },
} satisfies ConfigWithExtends;

/**
 * Pandell's non-language/framework-specific overrides of ESLint rules.
 */
export const esLintConfigPandellBase = {
  name: "@pandell/eslint-config/base",
  extends: [
    esLintConfigJsRecommended,
    esLintConfigJsDocRecommended,
    esLintConfigImportXRecommended,
    esLintConfigSimpleImportSort,
  ],
  rules: {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // "@eslint/js" rules
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    "eqeqeq": "error",
    "guard-for-in": "error",
    "no-console": ["error", { "allow": ["warn", "error", "group", "groupEnd"] }],
    "no-eval": "error",
    "no-new-wrappers": "error",
    "no-restricted-globals": ["error", "$", "jQuery", "R"],
    "no-shadow": ["error", { hoist: "functions" }],
    "no-template-curly-in-string": "warn",
    "no-throw-literal": "error",
    "no-undef-init": "warn",
    "no-unused-expressions": "error",
    "prefer-template": "warn",
    "radix": ["error", "as-needed"],
    "sort-imports": "off",

    // already set in "@eslint/js/config/recommended" in ESLint 9+
    // "no-shadow-restricted-names": "error",

    // deprecated in ESLint 9+
    // "spaced-comment": [
    //   "warn",
    //   "always",
    //   { block: { exceptions: ["*"], balanced: true }, line: { markers: ["/"] } },
    // ],

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // "eslint-plugin-import-x" rules
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    "import-x/first": "error",
    "import-x/newline-after-import": "error",
    "import-x/no-commonjs": "off", // handled by @typescript-eslint/no-require-imports
    "import-x/no-cycle": "error",
    "import-x/no-default-export": "error",
    "import-x/namespace": "off", // enabled in TypeScript rules because it requires a parser
    // "import-x/no-deprecated": "warn", // moved to TypeScript rules because it requires parser
    "import-x/no-duplicates": "error",
    "import-x/no-extraneous-dependencies": "error",
    "import-x/no-mutable-exports": "error",
    "import-x/no-self-import": "error",
    "import-x/no-unassigned-import": ["error", { "allow": ["**/*.css"] }],
    "import-x/no-useless-path-segments": "warn",

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // "eslint-plugin-jsdoc" rules
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    "jsdoc/check-tag-names": ["error", { "typed": true, "definedTags": ["jest-environment"] }],
    "jsdoc/no-defaults": "off",
    "jsdoc/require-jsdoc": "off",
    "jsdoc/require-param": "off",
    "jsdoc/require-returns": "off",
    "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }],

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // "eslint-plugin-simple-import-sort" rules
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
  },
} satisfies ConfigWithExtends;

/**
 * Pandell's TypeScript-specific overrides of ESLint rules.
 */
export function createEsLintConfigPandellTypeScript() {
  return {
    name: "@pandell/eslint-config/typescript-type-checked",
    extends: [esLintConfigImportXTypeScript, ...esLintTsConfigs.recommendedTypeChecked],
    files: typeScriptFileGlobs,
    languageOptions: {
      parserOptions: {
        project: true,
        // tsconfigRootDir: process.cwd(), // used by Anthony Fu https://github.com/antfu/eslint-config/blob/v2.20.0/src/configs/typescript.ts#L70, also requires import process from "node:process"; and "@types/node": "^20.14.2" in package.json
        // tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // "eslint-plugin-import-x" rules
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        // be more tolerant of missing return types
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }], // disallow "public" modifier
      "@typescript-eslint/naming-convention": "off", // don't enforce this
      "@typescript-eslint/no-explicit-any": "off", // allow explicit "any" (and TS handles implicit "any")
      "@typescript-eslint/no-require-imports": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error", // the typescript-eslint version accounts for optional call expressions `?.()` and directives in module declarations
      "@typescript-eslint/no-unused-vars": "off", // TS handles this
      "@typescript-eslint/no-use-before-define": "off", // TS handles this for variables
      "@typescript-eslint/no-var-requires": "off", // "no-require-imports" makes this redundant
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      "@typescript-eslint/prefer-readonly": "warn", // (typed)
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }], // the typescript-eslint version of "no-shadow" uses TypeScript's scope analysis, which reduces false positives that were likely when using the default ESLint version
      "@typescript-eslint/unbound-method": "off", // (typed) seems to be more annoying than helpful

      // already checked by TypeScript compiler
      // "no-redeclare": "off",
      // "@typescript-eslint/no-redeclare": "error", // the typescript-eslint version of "no-redeclare" uses TypeScript's scope analysis, which reduces false positives that were likely when using the default ESLint version

      // controversial rule that prevents some truthy/falsy-based patterns
      // "@typescript-eslint/prefer-nullish-coalescing": "warn", // (typed)

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // "eslint-plugin-import-x" rules
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      "import-x/namespace": "error",
      "import-x/no-deprecated": "warn",
    },
  } satisfies ConfigWithExtends;
}

/**
 * TODO
 */
export function createEsLintConfigPandellTypeScriptTypeChecked(
  options: PandellEsLintConfigOptions,
) {
  const { preferNullishCoalescing = "off" } = options;
  return {
    name: "@pandell/eslint-config/typescript-type-checked",
    extends: [
      esLintTsConfigs.recommendedTypeCheckedOnly[
        esLintTsConfigs.recommendedTypeCheckedOnly.length - 1
      ],
      esLintConfigImportXTypeScript,
    ],
    files: typeScriptFileGlobs,
    // languageOptions: {
    //   parserOptions: {
    //     project: true,
    //     // tsconfigRootDir: process.cwd(), // used by Anthony Fu https://github.com/antfu/eslint-config/blob/v2.20.0/src/configs/typescript.ts#L70, also requires import process from "node:process"; and "@types/node": "^20.14.2" in package.json
    //     // tsconfigRootDir: import.meta.dirname,
    //   },
    // },
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": preferNullishCoalescing, // (typed)
      "@typescript-eslint/prefer-readonly": "warn", // (typed)
      "@typescript-eslint/unbound-method": "off", // (typed) seems to be more annoying than helpful
    },
  } satisfies ConfigWithExtends;
}

/**
 * TODO
 */
export interface PandellEsLintConfigOptions {
  /**
   * TODO
   */
  readonly extraConfigs?: ConfigWithExtends[];

  /**
   * TODO
   *
   * @default "off"
   */
  readonly preferNullishCoalescing?: TSESLint.FlatConfig.RuleLevel;
}

/**
 * TODO
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function createPandellEsLintConfig(
  options: PandellEsLintConfigOptions,
): TSESLint.FlatConfig.ConfigPromise {
  const { extraConfigs = [] } = options;

  return esLintTsConfig(
    { name: "@pandell/eslint-config/ignores", ignores: [".yarn", "**/dist"] },
    esLintConfigPandellBase,
    createEsLintConfigPandellTypeScript(),
    // { ...esLintTsConfigs.recommendedTypeCheckedOnly[2], files: typeScriptFileGlobs },
    ...extraConfigs,
  );
}
