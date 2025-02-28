// No typings are available for "postcss-preset-env@7.x.x" as of 2025-02-26.

declare module "postcss-preset-env" {
  import type { Plugin } from "postcss";

  // eslint-disable-next-line import-x/no-default-export
  export default function postcssPresetEnv(options: {
    readonly stage: number;
    readonly autoprefixer: boolean | object;
    readonly features: Record<string, boolean | object>;
  }): Plugin;
}
