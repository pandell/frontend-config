// spell-checker:words indexeddb milang tses yalc

import esLintJs from "@eslint/js";
import type { TSESLint } from "@typescript-eslint/utils";
import type { ESLint, Linter } from "eslint";
import esLintImportX from "eslint-plugin-import-x";
import esLintJsDoc from "eslint-plugin-jsdoc";
import esLintSimpleImportSort from "eslint-plugin-simple-import-sort";

// =============================================================================
// Pandell configurations
// =============================================================================

/**
 * Pandell's non-language/framework-specific overrides of ESLint rules.
 */
function createPandellBaseConfig(
  settings: PandellEsLintConfigSettings,
): ReadonlyArray<Linter.FlatConfig> {
  const { funcStyle = ["error", "declaration"] } = settings;

  return [
    {
      ...esLintJs.configs.recommended,
      name: "eslint/js/recommended", // as of 2024-09-05, "@eslint/js" recommended config does not include a name
    },
    esLintImportX.flatConfigs.recommended as Linter.FlatConfig,
    {
      name: "simple-import-sort/all", // as of 2024-06-04, "eslint-plugin-simple-import-sort" isn't fully flat-config compatible, so adapt the plugin to the correct layout
      plugins: { "simple-import-sort": esLintSimpleImportSort },
      rules: {
        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",
      },
    },
    esLintJsDoc.configs["flat/recommended-error"],
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
        // "no-shadow-restricted-names": "error", // already "error" in "@eslint/js@9.9.1", "config/recommended"
        "no-shadow": ["error", { hoist: "functions" }],
        "no-template-curly-in-string": "warn",
        "no-throw-literal": "error",
        "no-undef-init": "warn",
        "no-unused-expressions": "error",
        "prefer-template": "warn",
        "radix": ["error", "as-needed"],
        "sort-imports": "off",
        // "spaced-comment": ["warn", "always", { block: { exceptions: ["*"], balanced: true }, line: { markers: ["/"] } }], // deprecated in ESLint 9+

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // "eslint-plugin-import-x" rules
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        "import-x/first": "error",
        "import-x/newline-after-import": "warn",
        // "import-x/no-commonjs": "off", // already "off" in "eslint-plugin-import-x@4.2.1", "flatConfigs.recommended"; handled by @typescript-eslint/no-require-imports
        "import-x/no-cycle": "error",
        "import-x/no-default-export": "error",
        "import-x/no-deprecated": "warn",
        // "import-x/no-duplicates": "error", // already "warn" in "eslint-plugin-import-x@4.2.1", "flatConfigs.recommended"
        "import-x/no-extraneous-dependencies": "error",
        "import-x/no-mutable-exports": "error",
        "import-x/no-named-default": "error",
        "import-x/no-self-import": "error",
        "import-x/no-unassigned-import": [
          "error",
          { "allow": ["**/*.css", "@testing-library/**", "fake-indexeddb/**"] },
        ],
        "import-x/no-useless-path-segments": "warn",
      },
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest", // eslint-plugin-import-x@4.2.1: rules "import-x/namespace", "import-x/no-deprecated" fail without this property: "sourceType 'module' is not supported when ecmaVersion < 2015. Consider adding `{ ecmaVersion: 2015 }` to the parser options."
        },
      },
    },
  ];
}

/**
 * Pandell's TypeScript-specific overrides of ESLint rules.
 */
async function createPandellTypeScriptConfig(
  settings: PandellEsLintConfigSettings,
): Promise<ReadonlyArray<Linter.FlatConfig>> {
  const { typeScript = {} } = settings;
  const {
    enabled = true,
    extraRules,
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
  const recommendedConfig = typeChecked
    ? esLintTs.configs.recommendedTypeChecked
    : esLintTs.configs.recommended;

  return esLintTs.config({
    name: `@pandell-eslint-config/typescript${typeChecked ? "-type-checked" : ""}`,
    extends: [
      ...recommendedConfig,
      {
        ...esLintImportX.flatConfigs.typescript,
        name: "import-x/typescript", // as of 2024-09-05, "eslint-plugin-import-x" typescript config does not include a name
      },
      esLintJsDoc.configs["flat/recommended-typescript-error"],
    ],
    files: resolvedFiles,
    ...(typeChecked && { languageOptions: { parserOptions } }),
    rules: {
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
      // "@typescript-eslint/naming-convention": "off", // already "off" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"; don't enforce this
      "@typescript-eslint/no-explicit-any": noExplicitAny, // TypeScript handles implicit "any"
      // "@typescript-eslint/no-require-imports": "error", // already "error" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"
      // "no-unused-expressions": "off", // already "off" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"
      // "@typescript-eslint/no-unused-expressions": "error", // already "error" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"; the typescript-eslint version accounts for optional call expressions `?.()` and directives in module declarations
      "@typescript-eslint/no-unused-vars": [
        // https://typescript-eslint.io/rules/no-unused-vars/#benefits-over-typescript
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
        },
      ],
      // "@typescript-eslint/no-use-before-define": "off", // already "off" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"; TS handles this for variables
      // "@typescript-eslint/no-var-requires": "off", // no such rule as of "typescript-eslint@8.4.0"; "no-require-imports" makes this redundant
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      // "no-redeclare": "off", // already "off" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"
      // "@typescript-eslint/no-redeclare": "error", // keep the recommended level, which is "off" in "typescript-eslint@8.4.0", both "recommended" and "recommendedTypeChecked"; the typescript-eslint version of "no-redeclare" uses TypeScript's scope analysis, which reduces false positives that were likely when using the default ESLint version
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }], // the typescript-eslint version of "no-shadow" uses TypeScript's scope analysis, which reduces false positives that were likely when using the default ESLint version

      ...(typeChecked && {
        "@typescript-eslint/no-deprecated": "error",
        "@typescript-eslint/prefer-nullish-coalescing": preferNullishCoalescing,
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/unbound-method": "off", // seems to be more annoying than helpful
      }),

      ...extraRules,
    },
  }) as ReadonlyArray<object> as ReadonlyArray<Linter.FlatConfig>; // 2024-06-10, milang: "(typescript-eslint@7.12.0)/TSESLint.FlatConfig.ConfigArray" is not compatible with "(eslint@9.4.0)/Linter.FlatConfig", so use TypeScript type-cast to keep it happy (this can hopefully be deleted in the future)
}

/**
 * Pandell's React-specific overrides of ESLint rules.
 */
async function createPandellReactConfig(
  settings: PandellEsLintConfigSettings,
): Promise<ReadonlyArray<Linter.FlatConfig>> {
  const { react = {}, typeScript = {} } = settings;
  const {
    enabled = false,
    extraRules,
    files = defaultTypeScriptFiles,
    includeReactQuery = false,
    typeChecked = true,
  } = react;
  const { enabled: enabledTypeScript = true, typeChecked: typeCheckedTypeScript = true } =
    typeScript;

  if (!enabled) {
    return [];
  }
  if (typeChecked && (!enabledTypeScript || !typeCheckedTypeScript)) {
    throw new Error("Type-checked React requires that TypeScript is enabled and type-checked.");
  }

  const [reactPlugin, hooksPlugin, refreshPlugin, queryPlugin] = await Promise.all([
    import("@eslint-react/eslint-plugin"),
    import("eslint-plugin-react-hooks"),
    import("eslint-plugin-react-refresh"),
    includeReactQuery ? import("@tanstack/eslint-plugin-query") : null,
  ]);
  const resolvedFiles = files === "do not set" ? undefined : files;
  const recommendedConfig = typeChecked
    ? (reactPlugin.default.configs["recommended-type-checked"] as unknown as Linter.FlatConfig)
    : (reactPlugin.default.configs.recommended as unknown as Linter.FlatConfig);

  const configs: Linter.FlatConfig[] = [
    {
      ...recommendedConfig,
      name: `@eslint-react/recommended${typeChecked ? "-type-checked" : ""}`,
      files: resolvedFiles,
    },
    {
      name: "react-hooks/recommended",
      files: resolvedFiles,
      plugins: { "react-hooks": hooksPlugin },
      rules: hooksPlugin.configs.recommended.rules,
    },
    {
      name: "react-refresh/recommended",
      files: resolvedFiles,
      plugins: { "react-refresh": refreshPlugin },
      rules: { "react-refresh/only-export-components": "warn" },
    },
  ];

  if (queryPlugin) {
    configs.push({
      name: "@tanstack/query/recommended",
      files: resolvedFiles,
      plugins: { "@tanstack/query": queryPlugin.default as unknown as ESLint.Plugin },
      rules: (queryPlugin.default.configs.recommended as Linter.FlatConfig).rules,
    });
  }

  configs.push({
    name: `@pandell-eslint-config/react${typeChecked ? "-type-checked" : ""}`,
    files: resolvedFiles,
    rules: {
      "@eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks": "warn",
      "@eslint-react/hooks-extra/no-unnecessary-use-callback": "warn",
      "@eslint-react/hooks-extra/no-unnecessary-use-memo": "warn",
      "@eslint-react/hooks-extra/ensure-use-memo-has-non-empty-deps": "warn",
      // "@eslint-react/hooks-extra/prefer-use-state-lazy-initialization": "warn", // already "warn" in "@eslint-react/eslint-plugin@1.13.0"
      "@eslint-react/prefer-destructuring-assignment": "off",
      "react-hooks/exhaustive-deps": [
        "warn",
        { additionalHooks: "^use(Disposables|EventHandler|StreamResult|StreamSubscription)$" },
      ],
      ...extraRules,
    },
  });

  return configs;
}

/**
 * Pandell's testing-specific overrides of ESLint rules.
 */
async function createPandellTestingConfig(
  settings: PandellEsLintConfigSettings,
): Promise<ReadonlyArray<Linter.FlatConfig>> {
  const { testing = {} } = settings;
  const {
    enabledTestingLibrary = false,
    enabledVitest = false,
    extraRules,
    files = defaultTestFiles,
  } = testing;

  const resolvedFiles = files === "do not set" ? undefined : files;
  const configs = [] as Linter.FlatConfig[];
  const [jsDom, testingLibrary, testingLibraryCompat, vitest] = await Promise.all([
    enabledTestingLibrary ? import("eslint-plugin-jest-dom") : null,
    enabledTestingLibrary ? import("eslint-plugin-testing-library") : null,
    enabledTestingLibrary ? import("@eslint/compat") : null,
    enabledVitest ? import("@vitest/eslint-plugin") : null,
  ]);
  if (jsDom && testingLibrary && testingLibraryCompat) {
    const testingLibraryReactFlatConfig = testingLibrary.default.configs["flat/react"];
    configs.push(
      {
        ...jsDom.default.configs["flat/recommended"],
        name: "jest-dom/flat-recommended",
        files: resolvedFiles,
      },
      {
        ...testingLibraryReactFlatConfig,
        name: "testing-library/react",
        // 2024-06-15, milang: eslint-plugin-testing-library currently does not support
        // ESLint 9 API; we have to use an adapter for the time being, see
        // https://github.com/testing-library/eslint-plugin-testing-library/issues/899#issuecomment-2121272355
        plugins: {
          "testing-library": testingLibraryCompat.fixupPluginRules(
            testingLibraryReactFlatConfig.plugins!["testing-library"],
          ),
        },
        files: resolvedFiles,
      },
    );
  }
  if (vitest) {
    configs.push({
      ...vitest.default.configs.recommended,
      name: "vitest/recommended",
      files: resolvedFiles,
    });
  }

  if (extraRules || enabledVitest) {
    configs.push({
      name: "@pandell-eslint-config/testing",
      files: resolvedFiles,
      rules: {
        ...(enabledVitest && {
          "vitest/consistent-test-it": "warn",
          "vitest/no-alias-methods": "warn",
          "vitest/no-conditional-tests": "error",
          "vitest/no-duplicate-hooks": "warn",
          "vitest/no-focused-tests": "error",
          "vitest/no-standalone-expect": "error",
          "vitest/prefer-each": "error",
          "vitest/prefer-hooks-in-order": "error",
          "vitest/prefer-hooks-on-top": "error",
          "vitest/prefer-lowercase-title": ["error", { "ignore": ["describe"] }],
          "vitest/prefer-spy-on": "warn",
          "vitest/prefer-strict-equal": "warn",
          "vitest/prefer-to-be": "warn",
          "vitest/prefer-to-contain": "warn",
          "vitest/prefer-todo": "warn",
          "vitest/require-hook": "error",
        }),
        ...extraRules,
      },
    });
  }

  return configs;
}

/**
 * Pandell's ViteJS-specific overrides of ESLint rules.
 */
function createPandellViteConfig(
  settings: PandellEsLintConfigSettings,
): ReadonlyArray<Linter.FlatConfig> {
  const { vite = {} } = settings;
  const {
    enabled = false,
    tsConfigPath = "tsconfig.node.json",
    viteConfigPath = "vite.config.ts",
  } = vite;

  if (!enabled) {
    return [];
  }

  return [
    {
      name: "@pandell-eslint-config/vite",
      files: [viteConfigPath],
      languageOptions: { parserOptions: { project: tsConfigPath } },
    },
  ];
}

// =============================================================================
// Configuration creation function.
// =============================================================================

/**
 * Files and directories that ESLint ignores in Pandell projects by default.
 */
export const defaultGlobalIgnores = [".yarn", ".yalc", "**/dist"];

/**
 * Files to which ESLint TypeScript rules apply in Pandell projects by default.
 */
export const defaultTypeScriptFiles = ["**/*.{ts,tsx}"];

/**
 * Files to which ESLint testing rules apply in Pandell projects by default.
 */
export const defaultTestFiles = ["**/*.test.{ts,tsx,js,jsx}"];

/**
 * Settings that control behavior of {@link createPandellEsLintConfig}.
 */
export interface PandellEsLintConfigSettings {
  /**
   * List of extra configuration layers to append to the end of ESLint configuration
   * sequence returned by {@link createPandellEsLintConfig}.
   */
  readonly extraConfigs?: ReadonlyArray<Linter.FlatConfig>;

  /**
   * Enforce the consistent use of either function declarations (default)
   * or expressions assigned to variables ("arrow functions").
   *
   * Rule "func-style", @see https://eslint.org/docs/latest/rules/func-style
   *
   * @default ["error","declaration"]
   */
  readonly funcStyle?: Linter.RuleEntry;

  /**
   * List of ESLint global ignores.
   *
   * From ESLint documentation, @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores:
   * "Patterns specified in files and ignores use minimatch syntax and are evaluated
   * relative to the location of the eslint.config.js file."
   *
   * @default defaultGlobalIgnores
   */
  readonly ignores?: Linter.FlatConfig["ignores"];

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
    readonly enabled?: boolean;

    /**
     * Extra rule configurations that will be appended to Pandell React configuration layer.
     */
    readonly extraRules?: Linter.FlatConfig["rules"];

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
     * @default defaultTypeScriptFiles
     */
    readonly files?: "do not set" | Linter.FlatConfig["files"];

    /**
     * Should the React configuration include TanStack Query rules?
     * (https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)
     * When false (default), final ESLint configuration will not include
     * TanStack Query layer at all.
     *
     * @default false
     */
    readonly includeReactQuery?: boolean;

    /**
     * Should the React configuration include type-checked rules?
     * This setting requires TypeScript configuration to be enabled and also
     * include type-checked rules.
     *
     * @default true
     */
    readonly typeChecked?: boolean;
  };

  /**
   * Settings for testing configuration layers (opt in, not enabled by default).
   */
  readonly testing?: {
    /**
     * Enable testing-library ESLint configuration layers. When false (default), final ESLint
     * configuration will not include testing-library layers at all.
     *
     * @default false
     */
    enabledTestingLibrary?: boolean;

    /**
     * Enable Vitest ESLint configuration layers. When false (default), final ESLint
     * configuration will not include Vitest layers at all.
     *
     * @default false
     */
    enabledVitest?: boolean;

    /**
     * Extra rule configurations that will be appended to Pandell testing configuration layer.
     */
    readonly extraRules?: Linter.FlatConfig["rules"];

    /**
     * List of files to apply testing configuration layers to.
     *
     * "do not set" indicates "files" property will not be set, i.e. the configuration
     * layers will apply to all files matched by ESLint.
     *
     * From ESLint documentation, @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores:
     * "Patterns specified in files and ignores use minimatch syntax and are evaluated
     * relative to the location of the eslint.config.js file."
     *
     * @default defaultTestFiles
     */
    readonly files?: "do not set" | Linter.FlatConfig["files"];
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
    readonly enabled?: boolean;

    /**
     * Extra rule configurations that will be appended to Pandell TypeScript configuration layer.
     */
    readonly extraRules?: Linter.FlatConfig["rules"];

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
     * @default defaultTypeScriptFiles
     */
    readonly files?: "do not set" | Linter.FlatConfig["files"];

    /**
     * Are explicit "any" type annotations allowed in TypeScript? ("give up on type-checking")
     *
     * Rule "@typescript-eslint/no-explicit-any", @see https://typescript-eslint.io/rules/no-explicit-any/
     *
     * @default "error"
     */
    readonly noExplicitAny?: Linter.RuleEntry;

    /**
     * Custom entry for "@typescript-eslint/prefer-nullish-coalescing" rule.
     *
     * Rule "@typescript-eslint/prefer-nullish-coalescing", @see https://typescript-eslint.io/rules/prefer-nullish-coalescing/
     *
     * @default "off"
     */
    readonly preferNullishCoalescing?: Linter.RuleEntry;

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
     * Note that using "import.meta.dirname" might require additional type definition as documented in
     * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#support-for-importmeta,
     * for example "interface ImportMeta { dirname: string; }".
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

  /**
   * Settings for ViteJS ESLint configuration layer.
   */
  readonly vite?: {
    /**
     * Enable ViteJS ESLint configuration layer. When false (default), final ESLint
     * configuration will not include ViteJS layer at all.
     *
     * @default false
     */
    readonly enabled?: boolean;

    /**
     * Sets the TSConfig file to set as "project" for ESLint TypeScript parser.
     *
     * @default "tsconfig.node.json"
     */
    readonly tsConfigPath?: string;

    /**
     * Sets the Vite configuration file path (used to set "files" for the configuration layer).
     *
     * @default "vite.config.ts"
     */
    readonly viteConfigPath?: string;
  };
}

/**
 * Creates Pandell ESLint configuration, applying specified customizations ("settings").
 */
export async function createPandellEsLintConfig(
  settings: PandellEsLintConfigSettings = {},
): Promise<ReadonlyArray<Linter.FlatConfig>> {
  const { extraConfigs = [], ignores = defaultGlobalIgnores } = settings;

  return [
    { name: "@pandell-eslint-config/ignores", ignores },
    ...createPandellBaseConfig(settings),
    ...(await createPandellTypeScriptConfig(settings)),
    ...(await createPandellReactConfig(settings)),
    ...(await createPandellTestingConfig(settings)),
    ...createPandellViteConfig(settings),
    {
      name: "@pandell-eslint-config/root-config-files",
      files: ["*.config.{js,mjs,cjs,ts,mts,cts}"],
      rules: {
        "import-x/no-default-export": "off",
      },
    },
    {
      // our jsDoc rules configuration from "createPandellBaseConfig" gets overwritten
      // by "createPandellTypeScriptConfig", so we moved then to a separate layer that
      // is processed last before extra configs
      name: "@pandell-eslint-config/jsdoc",
      rules: {
        "jsdoc/check-tag-names": [
          "error",
          { "typed": true, "definedTags": ["jest-environment", "vitest-environment"] },
        ],
        "jsdoc/no-defaults": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }],
      },
    },
    ...extraConfigs,
  ];
}
