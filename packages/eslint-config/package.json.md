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

### [eslint-plugin-react-hooks](https://github.com/facebook/react)

Major version 6 is a very disappointing release. Meta didn't even bother
publishing release notes for it. The plugin went from 0 dependencies
to 6 dependencies (including Babel). Size of the plugin went from 0.1 MB
to 2.1 MB. The included TypeScript definitions are incorrect, breaking
our build (v5 type definitions are significantly better).

As of October 2025, we are ignoring this major version. Unless Meta gets its
act together, we will stay on v5.

```sh
Package                      Current         Latest
eslint-plugin-react-hooks    5.2.0           6.1.0
```

## Resolutions

No resolutions are needed at this time.
