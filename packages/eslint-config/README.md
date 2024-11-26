# @pandell/eslint-config

Shared ESLint config for Pandell engineering teams.

## Usage

Add the following to your `package.json`:

```jsonc
{
  "devDependencies": {
    "@pandell/eslint-config": "^9.7.0",
    "eslint": "^9.15.0",
    // ...
  },
  // ...
}
```

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
