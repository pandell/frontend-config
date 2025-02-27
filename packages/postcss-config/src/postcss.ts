import type { AcceptedPlugin } from "postcss";
import postcssCalc from "postcss-calc";
import type { Options } from "postcss-mixins";
import postcssMixins from "postcss-mixins";
import postcssPresetEnv from "postcss-preset-env";

/**
 * Settings for postcss plugins.
 */
export interface PostcssPluginSettings {
  /**
   * If true, auto-prefixer will be disabled when generating CSS.
   */
  readonly disableAutoPrefixer?: boolean;

  /**
   * Object mapping mixin names to functions.
   *
   * Mixins will be globally available when processing CSS files (no @import required).
   */
  readonly mixins?: Options["mixins"];

  /**
   * Object mapping variable names to values.
   *
   * Variables will be globally available when processing CSS files (no @import required).
   */
  readonly variables?: { [name: string]: string | number };
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
    if (Object.prototype.hasOwnProperty.call(settings.variables, key)) {
      customProperties[key] = settings.variables[key];
      if (!key.startsWith("--")) {
        customProperties[`--${key}`] = settings.variables[key];
      }
    }
  }

  return [
    postcssMixins({ mixins: settings.mixins }),

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
