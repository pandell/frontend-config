# Notes for "eslint-config/package.json"

NodeJS/NPM don't allow comments in `package.json`, so we keep
notes and comments in this markdown file.

- [Properties](#properties)
- [Dependencies](#dependencies)
- [Resolutions](#resolutions)

## Properties

### "module"

According to Node [documentation](https://nodejs.org/docs/latest-v22.x/api/packages.html#package-entry-points),
`"module"` should not be needed when `package.json` defines an `"exports"` property.
However, as of 2025-02-26 the following reports an `import-x` error:

```js
// eslint.config.mjs

// @ts-check

import { createPandellEsLintConfig } from "@pandell/eslint-config";
// error: import-x/no-unresolved: Unable to resolve path to module '@pandell/eslint-config'
```

No such error is reported when `@pandell/eslint-config/package.json` contains `"module"`

Remove this property when `import-x` no longer reports this resolution error.

## Dependencies

All dependencies are up-to-date at this time.

## Resolutions

No resolutions are needed at this time.
