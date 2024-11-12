// spell-checker:word marko

declare module "eslint-plugin-testing-library" {
  import { ESLint, Linter } from "eslint";

  const plugin: {
    configs: {
      dom: Linter.Config;
      angular: Linter.Config;
      react: Linter.Config;
      vue: Linter.Config;
      marko: Linter.Config;
      ["flat/dom"]: Linter.Config;
      ["flat/angular"]: Linter.Config;
      ["flat/react"]: Linter.Config;
      ["flat/vue"]: Linter.Config;
      ["flat/marko"]: Linter.Config;
    };
    rules: ESLint.Plugin["rules"];
  };

  export default plugin; // eslint-disable-line import-x/no-default-export
}

declare module "eslint-plugin-jest-dom" {
  import { ESLint, Linter } from "eslint";

  const plugin: {
    configs: {
      "flat/all": Linter.Config;
      "flat/recommended": Linter.Config;
    };
    rules: ESLint.Plugin["rules"];
  };

  export default plugin; // eslint-disable-line import-x/no-default-export
}
