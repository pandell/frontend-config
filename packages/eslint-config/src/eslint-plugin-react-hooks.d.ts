// No typings are available for "eslint-plugin-react-hooks@5.x.x" as of 2025-02-26.

declare module "eslint-plugin-react-hooks" {
  import type { ESLint } from "eslint";

  export const configs: {
    readonly recommended: {
      readonly rules: {
        "react-hooks/rules-of-hooks": "error";
        "react-hooks/exhaustive-deps": "warn";
      };
    };
  };

  export const rules: ESLint.Plugin["rules"];
}
