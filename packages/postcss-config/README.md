# @pandell/postcss-config

Creates and configures PostCSS plugins as used in Pandell products.

Required for proper rendering of `web-pli` libraries (`@pandell/components`, `@pandell/gis`, etc).

## Usage: Vite

Add the following to your `vite.config.ts`:

```ts
// vite.config.ts

import { mixins as componentsMixins, vars as componentsVars } from "@pandell/components/css";
import { defaultPostcssPlugins } from "@pandell/postcss-config";
import { mixins as spritesMixins, vars as spritesVars } from "@pandell/sprites";
import { defineConfig } from "vite";

export default defineConfig({
    css:
        postcss: {
            // "postcss-import" via Vite, https://vite.dev/guide/features#import-inlining-and-rebasing
            // "postcss-mixins", "postcss-preset-env", "postcss-calc" via "defaultPostcssPlugins"
            plugins: defaultPostcssPlugins({
                mixins: { ...componentsMixins, ...spritesMixins },
                variables: { ...componentsVars, ...spritesVars },
            }),
        },

    // rest of Vite configuration
});
```

_Note_: `web-pli` prior to version 14 has no typing information for `@pandell/components/css`,
so TypeScript/ESLint will not be happy with the code above. To fix the issue,
add the following typings file and include it in `tsconfig.node.json`:

```ts
// vite.typings.d.ts

declare module "@pandell/components/css" {
    import type { Mixin } from "postcss";

    export const mixins: Record<string, Mixin>;
    export const vars: Record<string, string | number>;
}
```
