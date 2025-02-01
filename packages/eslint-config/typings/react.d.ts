declare module "eslint-plugin-react-hooks" {
  import type { ESLint } from "eslint";

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
