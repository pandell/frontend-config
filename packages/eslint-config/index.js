/* eslint-env node */

const config = {
    extends: ["eslint:recommended", "prettier", "plugin:jsdoc/recommended-error"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module"
    },
    plugins: ["import", "jsdoc", "simple-import-sort"],
    reportUnusedDisableDirectives: true,
    settings: {
        react: {
            version: "detect"
        }
    },
    rules: {
        // eslint builtin rules
        "eqeqeq": "error",
        "guard-for-in": "error",
        "no-console": ["error", { "allow": ["warn", "error", "group", "groupEnd"] }],
        "no-eval": "error",
        "no-new-wrappers": "error",
        "no-restricted-globals": ["error", "$", "jQuery", "R"],
        "no-shadow-restricted-names": "error",
        "no-shadow": ["error", { hoist: "functions" }],
        "no-template-curly-in-string": "warn",
        "no-throw-literal": "error",
        "no-undef-init": "warn",
        "no-unused-expressions": "error",
        "radix": ["error", "as-needed"],
        "sort-imports": "off",
        "spaced-comment": [
            "warn",
            "always",
            { block: { exceptions: ["*"], balanced: true }, line: { markers: ["/"] } }
        ],

        // eslint-plugin-import rules
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-commonjs": "off", // handled by @typescript-eslint/no-require-imports
        "import/no-cycle": "error",
        "import/no-default-export": "error",
        "import/no-deprecated": "warn",
        "import/no-duplicates": "error",
        "import/no-extraneous-dependencies": "error",
        "import/no-mutable-exports": "error",
        "import/no-self-import": "error",
        "import/no-unassigned-import": ["error", { "allow": ["**/*.css"] }],
        "import/no-useless-path-segments": "warn",

        // eslint-plugin-jsdoc rules
        "jsdoc/check-tag-names": ["error", { "definedTags": ["jest-environment"] }],
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }],

        // eslint-plugin-simple-sort rules
        "simple-import-sort/exports": "warn",
        "simple-import-sort/imports": "warn",

        // @typescript-eslint/recommended overrides
        "@typescript-eslint/indent": "off"
    }
};

module.exports = config;
