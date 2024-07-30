# @pandell/eslint-config

Shared ESLint config for Pandell engineering teams.

## Usage

Add the following to your `package.json`:

```jsonc
{
  "devDependencies": {
    "@pandell/eslint-config": "^9.0.1",
    "eslint": "^9.8.0",
    "eslint-plugin-testing-library": "^6.2.2", // see note 1 below
    // ...
  },
  "resolutions": { // see note below
    "@typescript-eslint/scope-manager": "^8.0.0-alpha.60",
    "@typescript-eslint/type-utils": "^8.0.0-alpha.60",
    "@typescript-eslint/types": "^8.0.0-alpha.60",
    "@typescript-eslint/utils": "^8.0.0-alpha.60"
  },
  // ...
}
```

---

> **Note 1** (`eslint-plugin-testing-library`) While all other plugins can co-exist with ESLint 9 and
are included as direct dependencies of `@pandell/eslint-config`, `eslint-plugin-testing-library` only
supports ESLint 8 as of June 2024. We chose to reference it as an optional peer dependency, not regular
dependency, thus it has to be added to your project's `package.json`. If you do not set
`enabledTestingLibrary` property (or set it to `false`), you do not need to include this dependency.
This recommendation will be removed in the future after `eslint-plugin-testing-library`
adds support for ESLint 9.

---

> **Note 2** (`resolutions`): We are currently using TypeScript ESLint pre-release (v8),
because the official release (v7) does not support ESLint 9 yet. Resolutions ensure that
all plugins use consistent TypeScript ESLint version. This recommendation will be removed
in the future after TypeScript ESLint v8 is released.

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
