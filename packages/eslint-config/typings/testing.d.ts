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
    };
    rules: ESLint.Plugin["rules"];
  };

  // eslint-disable-next-line import-x/no-default-export
  export default plugin;
}

declare module "eslint-plugin-jest-dom" {
  import { ESLint, Linter } from "eslint";

  const plugin: {
    configs: {
      "flat/all": Linter.FlatConfig;
      "flat/recommended": Linter.FlatConfig;
    };
    rules: ESLint.Plugin["rules"];
  };

  // eslint-disable-next-line import-x/no-default-export
  export default plugin;
}
