declare module "@tanstack/eslint-plugin-query" {
  import type { Linter } from "eslint";

  const plugin: {
    readonly configs: {
      readonly "flat/recommended": Array<Linter.Config>;
    };
  };

  // 2025-04-07, milang: typings for the latest Tanstack lint plugin
  // are currently incorrect for ESM mode, we override them here
  // (they use "export = plugin" instead of "export default plugin" in their "index.d.ts")
  export default plugin; // eslint-disable-line import-x/no-default-export
}
