# Notes for "package.json"

NodeJS/NPM don't allow comments in `package.json`, so we keep
notes and comments in this markdown file.

- [Dependencies](#dependencies)

## Dependencies

- `eslint-plugin-testing-library`  
  2024-06-14, milang: See note 1 in [README.md](README.md). Optional peer dependency
  should be deleted and `eslint-plugin-testing-library` should be converted to regular
  `dependency` when it adds support for ESLint 9 (version 7?).
