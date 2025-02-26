# Notes on Packages

- [Dependencies](#dependencies)

## Dependencies

The following packages (incomplete list) are currently not on their latest major versions.

### [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env)

Storybook fails to load with postcss-preset-env failing `"importFrom" is no longer supported.`
Used at <https://github.com/pandell/web-pli/blob/v12.0.0/packages/tools/cli/src/postcss.ts#L62>

```sh
Package                      Current         Latest
postcss-preset-env           7.8.3           10.1.5
```
