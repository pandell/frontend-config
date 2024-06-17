declare module "eslint-plugin-react-hooks" {
  import { ESLint } from "eslint";

  export const configs: {
    recommended: {
      rules: {
        "react-hooks/rules-of-hooks": "error";
        "react-hooks/exhaustive-deps": "warn";
      };
    };
  };

  export const rules: ESLint.Plugin["rules"];
}

declare module "eslint-plugin-react-refresh" {
  import { ESLint } from "eslint";

  export const rules: ESLint.Plugin["rules"];
}
