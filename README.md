# Pandell Frontend Configuration Packages

Shared configuration packages for frontend tools used by Pandell engineering teams.

- [`packages/browserslist-config`](packages/browserslist-config/)  
  Configuration for [browserslist](https://github.com/browserslist/browserslist): _Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env_

- [`packages/eslint-config`](packages/eslint-config/)  
  Configuration for [eslint](https://eslint.org/): _Find and fix problems in your JavaScript code_, and [typescript-eslint](https://typescript-eslint.io/): _The toolings that enables ESLint and Prettier to support TypeScript_

- [`packages/jest-config`](packages/jest-config/)  
  Pandell-defined reusable mocks and helpers for [jest](https://jestjs.io/): _Delightful JavaScript testing framework with a focus on simplicity_

- [`packages/prettier-config`](packages/prettier-config/)  
  Configuration for [prettier](https://prettier.io/): _An opinionated code formatter_

- [`packages/stylelint-config`](packages/stylelint-config/)  
  Configuration for [stylelint](https://stylelint.io/): _A mighty CSS linter that helps you avoid errors and enforce conventions_

- [`packages/typescript-config`](packages/typescript-config/)  
  Configuration for [typescript](https://www.typescriptlang.org/): _A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale_

## NPM registry tag management

When publishing a pre-release, we typically label it with a custom tag. It is a good idea to remove this tag once the pre-release is over. Use `npm dist-tag` subcommands to manage registry tags:

```sh
# list specified package's tags in the registry
npm dist-tag ls @pandell/jest-config

# tag the specified package version in the registry
npm dist-tag add @pandell/jest-config@4.2.0-preview.1 preview

# remove specified tag from the registry
npm dist-tag rm @pandell/jest-config preview
```
