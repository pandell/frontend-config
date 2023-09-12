# @pandell/prettier-config

Shared Prettier config for Pandell engineering teams.

For more details and configuration options, see the [prettier documentation](https://prettier.io/docs/en/configuration.html).

## Usage

To use modern (recommended) formatting, add the following to your `package.json`:

```json
{
  "prettier": "@pandell/prettier-config"
}
```

If you have been using Prettier in your project for a while and switching to modern
formatting would be too disruptive, add the following to your `package.json` to use
pre-September-2023 Prettier options:

```json
{
  "prettier": "@pandell/prettier-config/legacy.json"
}
```
