/* eslint-env jest,node */

/**
 * Defer loading ResizeObserver until it is first used.
 *
 * ResizeObserver grabs a reference to requestAnimationFrame when
 * it loads, which prevents it from using the mocked version produced
 * by our mockTimers function, so the following will force the module
 * to defer loading until a ResizeObserver is actually constructed.
 */
function ResizeObserverMock(callback) {
  const ResizeObserver = jest.requireActual("resize-observer-polyfill");
  return new ResizeObserver(callback);
}

module.exports = ResizeObserverMock;
