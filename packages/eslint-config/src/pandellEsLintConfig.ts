// spell-checker:words tses

import esLintJs from "@eslint/js";
import type { TSESLint } from "@typescript-eslint/utils";
import esLintImportX from "eslint-plugin-import-x";
import esLintJsDoc from "eslint-plugin-jsdoc";
import esLintSimpleImportSort from "eslint-plugin-simple-import-sort";

// =============================================================================
// 3rd party configurations & plugins
// =============================================================================

/**
 * As of 2024-06-04, "@eslint/js" recommended config does not include a name.
 * This config object adds a name.
 */
const esLintJsRecommendedConfig = {
  ...esLintJs.configs.recommended,
  name: "@eslint-js/recommended",
} satisfies TSESLint.FlatConfig.Config;

/**
 * As of 2024-06-04, "eslint-plugin-import-x" isn't fully flat-config
 * compatible, so adapt recommended config to the correct layout.
 */
const importXRecommendedConfig = {
  name: "eslint-plugin-import-x/recommended",
  plugins: { "import-x": esLintImportX },
  rules: esLintImportX.configs.recommended.rules,
} satisfies TSESLint.FlatConfig.Config;

/**
 * As of 2024-06-04, "eslint-plugin-import-x" isn't fully flat-config
 * compatible, so adapt TypeScript config as recommended in documentation
 * https://github.com/un-ts/eslint-plugin-import-x#typescript.
 */
const importXTypeScriptConfig = {
  ...esLintImportX.configs.typescript,
  name: "eslint-plugin-import-x/typescript",
  settings: {
    ...esLintImportX.configs.typescript.settings,
    "import-x/resolver": {
      typescript: true,
      node: true,
    },
  },
} satisfies TSESLint.FlatConfig.Config;

/**
 * As of 2024-06-04, "eslint-plugin-jsdoc" config does not include a name.
 * This config object adds a name.
 */
const jsDocRecommendedErrorConfig = {
  ...esLintJsDoc.configs["flat/recommended-error"],
  name: "eslint-plugin-jsdoc/recommended-error",
} satisfies TSESLint.FlatConfig.Config;

/**
 * As of 2024-06-04, "eslint-plugin-jsdoc" config does not include a name.
 * This config object adds a name.
 */
const jsDocRecommendedTypeScriptErrorConfig = {
  ...esLintJsDoc.configs["flat/recommended-typescript-error"],
  name: "eslint-plugin-jsdoc/recommended-typescript-error",
} satisfies TSESLint.FlatConfig.Config;

/**
 * As of 2024-06-04, "eslint-plugin-simple-import-sort" isn't fully flat-config
 * compatible, so adapt the plugin to the correct layout.
 */
const simpleImportSortConfig = {
  name: "eslint-plugin-simple-import-sort/base",
  plugins: { "simple-import-sort": esLintSimpleImportSort },
} satisfies TSESLint.FlatConfig.Config;

// =============================================================================
// Pandell configurations
// =============================================================================

/**
 * Pandell's overrides of JSDoc rules.
 *
 * See comments in {@link createPandellEsLintConfig} for more information about
 * why JSDoc rules were extracted into a separate layer that is included last.
 */
const pandellJsDocConfig = {
  name: "@pandell-eslint-config/jsdoc",
  rules: {
    "jsdoc/check-tag-names": ["error", { "typed": true, "definedTags": ["jest-environment"] }],
    "jsdoc/no-defaults": "off",
    "jsdoc/require-jsdoc": "off",
    "jsdoc/require-param": "off",
    "jsdoc/require-returns": "off",
    "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }],
  },
} satisfies TSESLint.FlatConfig.Config;

/**
 * Pandell's non-language/framework-specific overrides of ESLint rules.
 */
function createPandellBaseConfig(
  settings: PandellEsLintConfigSettings,
): TSESLint.FlatConfig.ConfigArray {
  const { funcStyle = ["error", "declaration"] } = settings;

  return [
    esLintJsRecommendedConfig,
    importXRecommendedConfig,
    simpleImportSortConfig,
    jsDocRecommendedErrorConfig,
    {
      name: "@pandell-eslint-config/base",
      rules: {
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // "@eslint/js" rules
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        "eqeqeq": "error",
        "func-style": funcStyle,
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

        // already off in "eslint-plugin-import-x@^0.5.1"
        // "import-x/no-commonjs": "off", // handled by @typescript-eslint/no-require-imports

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // "eslint-plugin-simple-import-sort" rules
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",
      },
    } satisfies TSESLint.FlatConfig.Config,
  ];
}

/**
 * Pandell's TypeScript-specific overrides of ESLint rules.
 */
async function createPandellTypeScriptConfig(
  settings: PandellEsLintConfigSettings,
): Promise<TSESLint.FlatConfig.ConfigArray> {
  const { typeScript = {} } = settings;
  const {
    enable: enabled = true,
    files = defaultTypeScriptFiles,
    noExplicitAny = "error",
    preferNullishCoalescing = "off",
    parserOptions = { project: true },
    typeChecked = true,
  } = typeScript;

  if (!enabled) {
    return [];
  }

  const esLintTs = await import("typescript-eslint");
  const resolvedFiles = files === "do not set" ? undefined : files;
  const recommendedRules = typeChecked
    ? esLintTs.configs.recommendedTypeChecked
    : esLintTs.configs.recommended;

  return esLintTs.config({
    name: `@pandell-eslint-config/typescript${typeChecked ? "-type-checked" : ""}`,
    extends: [
      // prettier-ignore -- do not single-line array entries
      ...recommendedRules,
      importXTypeScriptConfig,
      jsDocRecommendedTypeScriptErrorConfig,
    ],
    files: resolvedFiles,
    ...(typeChecked ? { languageOptions: { parserOptions } } : null),
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
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "no-public" }, // disallow "public" modifier
      ],
      "@typescript-eslint/naming-convention": "off", // don't enforce this
      "@typescript-eslint/no-explicit-any": noExplicitAny, // TypeScript handles implicit "any"
      "@typescript-eslint/no-require-imports": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error", // the typescript-eslint version accounts for optional call expressions `?.()` and directives in module declarations
      "@typescript-eslint/no-unused-vars": "off", // TS handles this
      "@typescript-eslint/no-use-before-define": "off", // TS handles this for variables
      "@typescript-eslint/no-var-requires": "off", // "no-require-imports" makes this redundant
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }], // the typescript-eslint version of "no-shadow" uses TypeScript's scope analysis, which reduces false positives that were likely when using the default ESLint version

      // already checked by TypeScript compiler
      // "no-redeclare": "off",
      // "@typescript-eslint/no-redeclare": "error", // the typescript-eslint version of "no-redeclare" uses TypeScript's scope analysis, which reduces false positives that were likely when using the default ESLint version

      ...(typeChecked
        ? {
            "@typescript-eslint/prefer-nullish-coalescing": preferNullishCoalescing,
            "@typescript-eslint/prefer-readonly": "warn",
            "@typescript-eslint/unbound-method": "off", // seems to be more annoying than helpful
          }
        : null),

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // "eslint-plugin-import-x" rules
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      "import-x/namespace": "error",
      "import-x/no-deprecated": "warn",
    },
  });
}

/**
 * Pandell's React-specific overrides of ESLint rules.
 */
async function createPandellReactConfig(
  settings: PandellEsLintConfigSettings,
): Promise<TSESLint.FlatConfig.ConfigArray> {
  const { react = {} } = settings;
  const { enable: enabled = true } = react;

  if (!enabled) {
    return [];
  }

  const reactRoot = (await import("@eslint/js")).default;
  return reactRoot instanceof Object ? [] : []; // silence TS/ESLint complaints for now
}

// =============================================================================
// Configuration creation function.
// =============================================================================

/**
 * Files and directories that ESLint ignores in Pandell projects by default.
 */
export const defaultGlobalIgnores = [".yarn", "**/dist"];

/**
 * Files to which ESLint TypeScript rules apply in Pandell projects by default.
 */
export const defaultTypeScriptFiles = ["**/*.ts", "**/*.tsx"];

/**
 * Settings that control behavior of {@link createPandellEsLintConfig}.
 */
export interface PandellEsLintConfigSettings {
  /**
   * List of extra configuration layers to append to the end of ESLint configuration
   * sequence returned by {@link createPandellEsLintConfig}.
   */
  readonly extraConfigs?: ReadonlyArray<TSESLint.FlatConfig.Config>;

  /**
   * Enforce the consistent use of either function declarations (default)
   * or expressions assigned to variables ("arrow functions").
   *
   * Rule "func-style", @see https://eslint.org/docs/latest/rules/func-style
   *
   * @default ["error","declaration"]
   */
  readonly funcStyle?: TSESLint.FlatConfig.RuleEntry;

  /**
   * List of ESLint global ignores.
   *
   * From ESLint documentation, @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores:
   * "Patterns specified in files and ignores use minimatch syntax and are evaluated
   * relative to the location of the eslint.config.js file."
   *
   * @default defaultGlobalIgnores
   */
  readonly ignores?: TSESLint.FlatConfig.Config["ignores"];

  /**
   * Settings for React ESLint configuration layers (opt in, not enabled by default).
   */
  readonly react?: {
    /**
     * Enable React ESLint configuration layers. When false (default), final ESLint
     * configuration will not include React layers at all.
     *
     * @default false
     */
    readonly enable?: boolean;
  };

  /**
   * Settings for TypeScript ESLint configuration layers.
   */
  readonly typeScript?: {
    /**
     * Enable TypeScript ESLint configuration layers. When false, final ESLint
     * configuration will not include TypeScript layers at all.
     *
     * @default true
     */
    readonly enable?: boolean;

    /**
     * List of files to apply TypeScript configuration layers to.
     *
     * "do not set" indicates "files" property will not be set, i.e. the configuration
     * layers will apply to all files matched by ESLint.
     *
     * From ESLint documentation, @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores:
     * "Patterns specified in files and ignores use minimatch syntax and are evaluated
     * relative to the location of the eslint.config.js file."
     *
     * @default typeScriptFileGlobs
     */
    readonly files?: "do not set" | TSESLint.FlatConfig.Config["files"];

    /**
     * Are explicit "any" type annotations allowed in TypeScript? ("give up on type-checking")
     *
     * Rule "@typescript-eslint/no-explicit-any", @see https://typescript-eslint.io/rules/no-explicit-any/
     *
     * @default "error"
     */
    readonly noExplicitAny?: TSESLint.FlatConfig.RuleEntry;

    /**
     * Custom entry for "@typescript-eslint/prefer-nullish-coalescing" rule.
     *
     * Rule "@typescript-eslint/prefer-nullish-coalescing", @see https://typescript-eslint.io/rules/prefer-nullish-coalescing/
     *
     * @default "off"
     */
    readonly preferNullishCoalescing?: TSESLint.FlatConfig.RuleEntry;

    /**
     * Custom value for "parserOptions" of "typescript-eslint", @see https://typescript-eslint.io/packages/parser/#configuration.
     *
     * Anthony Fu configuration https://github.com/antfu/eslint-config/blob/v2.20.0/src/configs/typescript.ts#L70
     * uses "process.cwd()" for "parserOptions.tsconfigRootDir", but this makes configuration
     * behavior dependent on current directory which can change dynamically.
     * Note that using "process" requires "import process from 'node:process';"
     * and addition of "@types/node" to "package.json".
     *
     * "typescript-eslint" documentation https://typescript-eslint.io/getting-started/typed-linting/
     * recommends using "import.meta.dirname" for "parserOptions.tsconfigRootDir",
     * but this doesn't work in a shared library, as it would set the root directory
     * to somewhere in "node_modules/...".
     *
     * @default {project:true}
     */
    readonly parserOptions?: TSESLint.ParserOptions;

    /**
     * Should the TypeScript configuration include type-checked rules?
     * This setting requires project to be using "tsconfig.json" and might reduce
     * speed of linting the project, but is strongly recommended for all Pandell projects.
     *
     * @default true
     */
    readonly typeChecked?: boolean;
  };
}

/**
 * Creates Pandell ESLint configuration, applying specified customizations ("settings").
 */
export async function createPandellEsLintConfig(
  settings: PandellEsLintConfigSettings = {},
): TSESLint.FlatConfig.ConfigPromise {
  const { extraConfigs = [], ignores = defaultGlobalIgnores } = settings;

  return [
    { name: "@pandell-eslint-config/ignores", ignores },
    ...createPandellBaseConfig(settings),
    ...(await createPandellTypeScriptConfig(settings)),
    ...(await createPandellReactConfig(settings)),
    pandellJsDocConfig, // our jsDoc rules configuration from "createPandellBaseConfig" gets overwritten by "createPandellTypeScriptConfig", so we moved then to a separate layer that is processed last before extra configs
    ...extraConfigs,
  ];
}
