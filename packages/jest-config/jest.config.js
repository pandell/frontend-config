/* global module, process */

module.exports = {
  moduleNameMapper: {
    // mock out image assets: https://jestjs.io/docs/en/webpack#handling-static-assets
    "\\.(jpg|png|svg)$": "@pandell/jest-config/__mocks__/fileMock.js",

    // mock CSS modules with a proxy object that simply returns the
    // name of the property being requested (e.g., styles.myClass === "myClass")
    "\\.css$": "identity-obj-proxy",
  },
  modulePaths: ["<rootDir>/src/*.Web/node_modules/"],
  reporters: process.env.TEAMCITY_VERSION ? ["@pandell/jest-teamcity"] : ["default"],
  roots: ["<rootDir>/src/*.Web/app", "<rootDir>/node_modules/@pandell/jest-config"],
  setupFilesAfterEnv: ["@testing-library/jest-dom", "@pandell/jest-config/configureTesting.js"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/*.Web/app/*/*.tests.*"],
  transformIgnorePatterns: ["node_modules/(?!(@?@pandell)/)"],
};
