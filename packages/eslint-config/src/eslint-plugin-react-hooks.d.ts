// As of "eslint-plugin-react-hooks@7.0.0", the typings included
// in the package don't work when used with "await import",
// so we replace them with our simplified version that keeps TypeScript happy.

declare module "eslint-plugin-react-hooks" {
  import type { ConfigObject } from "@eslint/core";

  const reactHooksExports: {
    configs: {
      flat: {
        /** All recommended rules. */
        recommended: ConfigObject;

        /** All recommended rules with bleeding edge experimental compiler rules. */
        "recommended-latest": ConfigObject;
      };
    };
  };

  // eslint-disable-next-line import-x/no-default-export
  export default reactHooksExports;
}
