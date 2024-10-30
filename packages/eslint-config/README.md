# @pandell/eslint-config

Shared ESLint config for Pandell engineering teams.

## Usage

Add the following to your `package.json`:

```jsonc
{
  "resolutions": {
    "@typescript-eslint/utils": "^8.12.2" // see note 1
  },
  "devDependencies": {
    "@pandell/eslint-config": "^9.5.1",
    "eslint": "^9.13.0",
    // ...
  },
  // ...
}
```

---

> **Note 1** `eslint-plugin-testing-library` depends on a very old version of `typescript-eslint`
library for no good reason. We recommend resolving it to the latest version, to be
consistent with `@pandell/eslint-config`. We should be able to remove the resolution
once testing library plugin upgrades to the latest major version of `typescript-eslint`.

---

Next, create `eslint.config.mjs` in the root of your project. Explore available properties
in the settings object passed to `createPandellEsLintConfig` function (see `PandellEsLintConfigSettings`
in `node_modules/@pandell/eslint-config/dist/pandellEsLintConfig.d.ts`). Example contents:

```js
// @ts-check

import { createPandellEsLintConfig } from "@pandell/eslint-config";

export default createPandellEsLintConfig({
    // type-checked typescript is enabled by default; to disable type-checking
    // rules, uncomment the following line:
    // typeScript: { typeChecked: false },
    react: { enabled: true },
    vite: { enabled: true },
    testing: { enabledJsDom: true, enabledTestingLibrary: true },
});
```

For more details and options for configuration, see the [ESLint documentation](https://eslint.org/docs/user-guide/configuring/).
