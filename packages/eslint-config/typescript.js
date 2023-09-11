/* eslint-env node */

// typescript rules
const config = {
    extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:jsdoc/recommended-typescript-error",
        "prettier"
    ],
    plugins: ["@typescript-eslint"],
    rules: {
        // @typescript-eslint/recommended overrides
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "@typescript-eslint/explicit-function-return-type": [
            "warn",
            // be more tolerant of missing return types
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true
            }
        ],
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }], // disallow "public" modifier
        "@typescript-eslint/naming-convention": "off", // don't enforce this
        "@typescript-eslint/no-explicit-any": "off", // allow explicit "any" (and TS handles implicit "any")
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unused-vars": "off", // TS handles this
        "@typescript-eslint/no-use-before-define": "off", // TS handles this for variables
        "@typescript-eslint/no-var-requires": "off", // "no-require-imports" makes this redundant
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-function-type": "warn",

        // this is only valid in TS files
        "prefer-template": "warn",

        // eslint-plugin-jsdoc rules (we have to set them again because
        // "plugin:jsdoc/recommended-typescript-error" overwrites our
        // "@pandell/eslint-config" settings)
        "jsdoc/check-tag-names": ["error", { "typed": true, "definedTags": ["jest-environment"] }],
        "jsdoc/no-defaults": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }],

        // the typescript-eslint version accounts for optional call expressions `?.()` and directives in module declarations
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": ["error"],

        // the typescript-eslint versions of "no-redeclare" and "no-shadow" use
        // TypeScript's scope analysis, which reduces false positives that were
        // likely when using the default ESLint versions
        "no-redeclare": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-redeclare": "error",
        "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }]
    }
};

module.exports = config;
