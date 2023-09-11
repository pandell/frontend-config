/* eslint-env node */

// testing overrides
const config = {
    env: {
        jest: true
    },
    rules: {
        "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": false }], // allow @ts-expect-error in tests
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "react/button-has-type": "off",
        "react/display-name": "off",
        "react/jsx-key": "off"
    }
};

module.exports = config;
