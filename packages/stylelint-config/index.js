/* eslint-env node */

"use strict";

module.exports = {
  extends: "stylelint-config-standard",
  plugins: ["stylelint-no-unsupported-browser-features", "stylelint-order"],
  rules: {
    "alpha-value-notation": null,
    "at-rule-no-unknown": [true, { "ignoreAtRules": ["mixin", "define-mixin"] }],
    "color-function-notation": null,
    "custom-property-pattern": null,
    "custom-property-empty-line-before": [
      "always",
      { "except": ["after-custom-property", "first-nested"] },
    ],
    "declaration-property-value-no-unknown": true,
    "import-notation": null,
    "number-max-precision": null,
    "order/properties-alphabetical-order": true,
    "property-no-vendor-prefix": null,
    // camelCase patterns (default in standard was kabob case)
    "selector-class-pattern": ["^[a-z]+[A-Za-z0-9_\\-]*$"],
    "selector-id-pattern": ["^[a-z]+[A-Za-z0-9_\\-]*$"],
    "selector-pseudo-element-colon-notation": null,
    "selector-no-vendor-prefix": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["export", "import", "global", "local", "external"],
      },
    ],
    "selector-type-no-unknown": [
      true,
      {
        "ignoreTypes": ["from"],
      },
    ],
    "plugin/no-unsupported-browser-features": [
      true,
      {
        "ignore": ["css-nesting"], // postcss @mixins are incorrectly identified as nested CSS
        "ignorePartialSupport": true,
      },
    ],
    // composes names
    "value-keyword-case": null,
  },
};
