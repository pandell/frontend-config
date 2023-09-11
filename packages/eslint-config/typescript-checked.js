/* eslint-env node */

// typescript rules with type information
const config = {
    extends: ["plugin:@typescript-eslint/recommended-requiring-type-checking"],
    rules: {
        // TODO: look into re-enabling these in v10
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/restrict-template-expressions": "off",

        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/unbound-method": ["off"] // seems to be more annoying than helpful
    }
};

module.exports = config;
