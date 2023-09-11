/* eslint-env node */

// react rules
const config = {
    extends: ["plugin:react/recommended", "prettier"],
    plugins: ["css-modules", "react", "react-hooks"],
    rules: {
        // eslint-plugin-css-modules rules
        "css-modules/no-undef-class": "error",

        // eslint-plugin-react rules
        "react/button-has-type": "error",
        "react/no-access-state-in-setstate": "error",
        "react/no-did-mount-set-state": "error",
        "react/no-did-update-set-state": "error",
        "react/no-unused-state": "error",
        "react/no-unsafe": "error",
        "react/prefer-stateless-function": "warn",
        "react/prop-types": "off", // we don't use prop-types
        "react/no-unknown-property": ["error", { ignore: ["css"] }], // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md#rule-options

        // eslint-plugin-react-hooks rules
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": [
            "warn",
            { additionalHooks: "^use(Disposables|EventHandler|StreamResult|StreamSubscription)$" }
        ]
    }
};

module.exports = config;
