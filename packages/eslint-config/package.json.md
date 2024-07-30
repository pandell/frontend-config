# Notes for "package.json"

NodeJS/NPM don't allow comments in `package.json`, so we keep
notes and comments in this markdown file.

## Packages

- `eslint-plugin-testing-library`  
  2024-06-14, milang: See note 1 in [README.md](README.md). Optional peer dependency
  should be deleted and `eslint-plugin-testing-library` should be converted to regular
  `dependency` when it adds support for ESLint 9 (version 7?).

- `typescript-eslint`  
  2024-06-14, milang: We are using v8 pre-release because v7 does not officially
  support ESLint9 (it seemed to work, but v8 adds official support, plus the usual
  supposed internal enhancements and performance improvements; in my testing v8 was
  working reliably despite being pre-release).
    - Note about `resolutions` in root `package.json` (not `package/eslint-config/package.json`):
      should be removed when v8 is released and all our plugins accept v8 as a dependency.
