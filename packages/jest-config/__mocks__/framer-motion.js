/* eslint-env jest,node,browser,es6 */

import React from "react";

const actual = jest.requireActual("framer-motion");

module.exports = Object.assign({}, actual, {
  motion: new Proxy(actual.motion, {
    get(target, componentName) {
      if (!global._framerMotionTestMode) {
        return actual.motion[componentName];
      }

      // if test mode is enabled, just return the component name (e.g., "div"),
      // which will create a plain element (and if a custom component is requested,
      // return the identity function)
      return componentName === "custom" ? (c) => c : componentName;
    },
  }),
  AnimatePresence: (props) => {
    return global._framerMotionTestMode
      ? props.children
      : React.createElement(actual.AnimatePresence, props);
  },
  enableTestMode() {
    global._framerMotionTestMode = true;
  },
  disableTestMode() {
    global._framerMotionTestMode = false;
  },
});
