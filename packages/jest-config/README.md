# @pandell/jest-config

Shared testing mocks and helpers for Pandell engineering teams.

## Usage

To mock static assets like images, define the following mapping in `jest.config.js`:

```js
module.exports = {
    // ...
    moduleNameMapper: {
        // ...
        "\\.(jpg|png|svg)$": "@pandell/jest-config/__mocks__/fileMock.js",
    }
}
```

To perform additional setup tasks as defined in `@pandell/jest-config/configureTesting.js`, add the following setup definition:

```js
module.exports = {
    // ...
    setupFilesAfterEnv: [
        // ...
        "@pandell/jest-config/configureTesting.js"
    ]
}
```
