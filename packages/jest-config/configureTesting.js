/* eslint-env node,browser */

module.exports = function setup() {
  if (typeof window !== "undefined") {
    // per: https://github.com/facebook/react/pull/11636

    // By default React calls console.error() for any errors, caught or
    // uncaught, however it is annoying to capture console output any time
    // we test for component exceptions. "suppressReactErrorLogging" lets us
    // opt out of extra console error reporting for most tests except
    // for the few that specifically test the logging by shadowing this
    // property. In real apps, it would usually not be defined at all.
    Error.prototype.suppressReactErrorLogging = true;
    DOMException.prototype.suppressReactErrorLogging = true;

    // needed by popper.js, not yet supported: https://github.com/jsdom/jsdom/issues/317
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document,
      },
    });
  }
};
