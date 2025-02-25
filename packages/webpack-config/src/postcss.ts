import type { AcceptedPlugin } from "postcss";
import postcssCalc from "postcss-calc";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const postcssPresetEnv = require("postcss-preset-env");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const postcssMixins = require("postcss-mixins");

/**
 * Settings for postcss plugins.
 */
export interface PostcssPluginSettings {
  /**
   * If true, auto-prefixer will be disabled when generating CSS.
   */
  disableAutoPrefixer?: boolean;

  /**
   * Object mapping mixin names to functions.
   *
   * Mixins will be globally available when processing CSS files (no @import required).
   */
  mixins?: { [name: string]: () => string | Record<string, string> };

  /**
   * Object mapping variable names to values.
   *
   * Variables will be globally available when processing CSS files (no @import required).
   */
  variables?: { [name: string]: string | number };
}

/**
 * Create an array of Postcss plugins for the given settings.
 *
 * @param settings
 *     Settings controlling CSS file processing.
 * @returns
 *     Postcss.Processor instance.
 */
export function defaultPostcssPlugins(settings: PostcssPluginSettings): AcceptedPlugin[] {
  const customProperties: Record<string, string | number> = {};
  for (const key in settings.variables) {
    // eslint-disable-next-line no-prototype-builtins
    if (settings.variables.hasOwnProperty(key)) {
      customProperties[key] = settings.variables[key];
      if (!key.startsWith("--")) {
        customProperties[`--${key}`] = settings.variables[key];
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    postcssMixins({ mixins: settings.mixins }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    postcssPresetEnv({
      stage: 1,
      autoprefixer: settings.disableAutoPrefixer ? false : { grid: "autoplace" },
      features: {
        "custom-properties": {
          // while `importFrom` eventually will be deprecated, the changes are still in early discussion.
          // see https://github.com/csstools/postcss-plugins/discussions/192 to follow along
          disableDeprecationNotice: true,

          importFrom: [{ customProperties }],
          preserve: false,
        },
        "nesting-rules": true,
      },
    }),
    postcssCalc({}), // not included in preset-env
  ];
}
