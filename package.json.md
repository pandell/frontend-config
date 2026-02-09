# Notes for "package.json"

NodeJS/NPM don't allow comments in `package.json`, so we keep
notes and comments in this markdown file.

- [Properties](#properties)
- [Dependencies](#dependencies)
- [Resolutions](#resolutions)

## Properties

No extra properties are needed at this time.

## Dependencies

### [eslint](https://eslint.org/)

Migration to ESLint 10 is on hold until the plugins we use add support for v10.

```sh
Package                      Current         Latest
eslint                       9.39.2          10.0.0
```

## Resolutions

### `debug`

Checkmarx indicates that `debug` below version 4.4.0 has vulnerability
CWE-1333, Inefficient Regular Expression Complexity. Currently
`eslint-import-resolver-node@0.3.9` depends on `debug@^3.2.7`.
Adding a resolution to the latest version, `debug@^4.4.1`, does not
have any negative impact on build or tests.
