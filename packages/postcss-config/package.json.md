# Notes for "postcss-config/package.json"

NodeJS/NPM don't allow comments in `package.json`, so we keep
notes and comments in this markdown file.

- [Dependencies](#dependencies)
- [Resolutions](#resolutions)

## Dependencies

### [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env)

Storybook fails to load with postcss-preset-env failing `"importFrom" is no longer supported.`  
Used at [`/packages/postcss-config/src/postcss.ts`](https://github.com/pandell/frontend-config/tree/%40pandell/postcss-config%408.0.0/packages/postcss-config/src/postcss.ts#L62).

`importFrom` has been deprecated and at the time our `postcss` pipeline was designed
there wasn't an officially supported replacement. We are currently using the latest
`postcss-preset-env` version that still supports `importFrom`. For more details,
see [the discussion](https://github.com/csstools/postcss-plugins/discussions/192).

```sh
Package                      Current         Latest
postcss-preset-env           7.8.3           10.2.4
```

## Resolutions

No resolutions are needed at this time.
