# Notes for "package.json"

NodeJS/NPM don't allow comments in `package.json`, so we keep
notes and comments in this markdown file.

- [Version](#version)
- [Scripts](#scripts)

## Version

Major version number should be following major version of `browserslist`
in `frontend-config/package.json`.

## Scripts

### `browserslist:*`

Scripts with `browserslist` prefix are used to print browsers that satisfy the Pandell
specification (found in `packages/browserslist-config/index.js`) for our three environments
(`development`, `production`, `test`). For example:

```shell
cd ~/development/frontend-config
yarn workspace @pandell/browserslist-config run browserslist:dev
# => and_chr 125
# => chrome 125
# => ...
```

The top-level `browserslist` property in `packages/browserslist-config/package.json`
is required in order for the `browserslist` CLI tool to use our specification.
Without it, `browserslist` prints browsers that satisfy the `default` specification,
which is not what we are currently using.

Please note that both `scripts` and `browserslist` top-level properties are removed
from `package.json` during packaging (i.e. when publishing to NPM).
