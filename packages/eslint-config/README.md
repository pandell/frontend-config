# @pandell/eslint-config

Shared ESLint config for Pandell engineering teams.

## Usage

Add the following to your `package.json`:

```jsonc
{
  "devDependencies": {
    "@pandell/eslint-config": "^9.19.0",
    "eslint": "^9.31.0",
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
    typescript: {
        // type-checked typescript is enabled by default; uncomment the following line to disable:
        // typeChecked: false,

        // strict typescript is enabled by default; uncomment the following line to disable:
        // strict: false,
    }
    react: { enabled: true },
    vite: { enabled: true },
    testing: { enabledJsDom: true, enabledTestingLibrary: true },
});
```

For more details and options for configuration, see the
[ESLint documentation](https://eslint.org/docs/user-guide/configuring/).

---

You can review your ESLint configuration with
[ESLint config inspector](https://eslint.org/blog/2024/04/eslint-config-inspector/).
It will start a local web server and open browser that navigates to this server,
allowing you to visually examine your layers, rules, etc.

```shell
yarn run eslint --inspect-config
```
