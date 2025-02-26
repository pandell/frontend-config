// spell-checker:words animejs csspack flatbush flatqueue johng kdbush pathinfo somemodule supercluster

import type { PostcssPluginSettings } from "@pandell/postcss-config";
import { defaultPostcssPlugins } from "@pandell/postcss-config";
import AssetsPlugin from "assets-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import fs from "fs";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { App } from "open";
import open from "open";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import type {
  Compiler,
  Configuration,
  FileCacheOptions,
  ResolveOptions,
  RuleSetRule,
  StatsOptions,
  WebpackPluginFunction,
  WebpackPluginInstance,
} from "webpack";
import { BannerPlugin, DefinePlugin } from "webpack";

/**
 * Default set of modules that should be transformed by "babel-loader" in webpack.
 */
const babelWhitelist = [
  "@react-leaflet",
  "@react-leaflet/core",
  "abort-controller",
  "animejs",
  "date-fns",
  "event-target-shim",
  "flatbush",
  "flatqueue",
  "kdbush",
  "react-leaflet",
  "react-spring",
  "supercluster",
];

/**
 * Default patterns for CSS module files.
 */
const defaultCssModulePatterns = [/\.module\.css$/];

/**
 * Template for version check script that will be injected into all output javascript files
 *
 * This script prevents the browser from executing code in incompatible
 * files (which usually results in a crash).
 *
 * Consider browser using cached version of "A.js" but then loading new version
 * of "B.js"; if "B.js" depends on a new library that only exists in new version
 * of "A.js", it will crash.
 */
function getVersionCheckScript(bundleVersion: string): string {
  return `
(function() {
    if (typeof window === "undefined") { return; }
    var v = window.PliAppVersion;
    if (!v) {
        window.PliAppVersion = '${bundleVersion}';
    } else if (v !== '${bundleVersion}') {
        location.reload(true);
    }
}());`
    .replace(/\r?\n/g, "") // strip newlines
    .replace(/\s{2,}/g, " "); // normalize whitespace
}

// Regular expression to match regular expression special characters for escaping in toRegExLiteral
const toLiteralRegex = new RegExp("[\\\\\\[\\]\\^\\{\\}\\<\\>\\-\\$\\.\\?\\*\\(\\)\\|\\+]", "g");

/**
 * Escape special regex characters so that they are matched literally.
 *
 * (E.g. a string containing "." will match dot, not any character, at that position).
 *
 * @param value
 *     String to convert to literal regex.
 * @returns
 *     A string that can be used in a RegExp object for matching literal values.
 */
function toRegExLiteral(value: string | null | undefined): string {
  return value ? value.toString().replace(toLiteralRegex, (c) => `\\${c}`) : "";
}

// based on "minimal" preset
const statsOptions: StatsOptions = {
  all: false,
  errorDetails: !!process.env.WEBPACK_ERROR_DETAILS,
  errors: true,
  logging: "info",
  modules: true,
  modulesSpace: 0,
  timings: true,
  warnings: true,
};

function envIsTrue(key: string): boolean {
  const value = process.env[key];
  if (!value) {
    return false;
  }
  return value.toLowerCase() === "true" || value === "1";
}

class OpenBrowserPlugin implements WebpackPluginInstance {
  constructor(
    private readonly _openPage: string,
    private readonly _openBrowser?: App | readonly App[],
  ) {}

  apply(compiler: Compiler): void {
    compiler.hooks.done.tap("OpenBrowserPlugin", () => {
      if (this._opened) {
        return;
      }
      open(this._openPage, this._openBrowser ? { app: this._openBrowser } : undefined)
        .catch(() => {
          console.warn("Unable to open browser");
        })
        .finally(() => {
          this._opened = true;
        });
    });
  }

  private _opened = false;
}

/**
 * Webpack resolve configuration.
 */
export interface WebpackResolve extends ResolveOptions {
  /**
   * Array of field names in description files (e.g. package.json) that contain alias definitions.
   */
  aliasFields?: string[];

  /**
   * Ordered array of absolute/relative paths to use for module resolution.
   *
   * @default ["node_modules"]
   */
  modules?: string[];
}

/**
 * Extension of Webpack configuration with the dev server field.
 */
export interface WebpackConfigurationWithDevServer extends Configuration {
  /**
   * Webpack dev server configuration.
   *
   * This is described here: https://webpack.js.org/configuration/dev-server/
   */
  readonly devServer?: Record<string, unknown>;
}

/**
 * Settings to use when generating configuration.
 */
export interface WebpackSettings {
  /**
   * Application version string.
   */
  appVersion?: string;

  /**
   * 3rd party modules that should be transformed with Babel (e.g., because they export ES6 code by default).
   */
  babelWhitelist?: string[];

  /**
   * Hostname to use for listening on front-end web server (serving webpack bundles).
   *
   * Will be used to generate publicPath parameter.
   *
   * @default "localhost"
   */
  clientHost?: string;

  /**
   * Patterns of CSS files with CSS module output that may be imported by JS code.
   *
   * @default `[/\.module\.css$/]`
   */
  cssModulePatterns?: RegExp[];

  /**
   * CSS mixins to make globally available.
   */
  cssMixins?: PostcssPluginSettings["mixins"];

  /**
   * CSS variables to make globally available.
   */
  cssVariables?: PostcssPluginSettings["variables"];

  /**
   * Dictionary of values that will be inlined into output bundles.
   */
  define?: { [definition: string]: unknown };

  /**
   * Enables caching the generated webpack modules and chunks to improve build speed during development.
   *
   * If enabled, sets `cache.type` to `filesystem`.
   *
   * NOTE: Dev server only.
   *
   * @default false
   */
  enableCaching?: boolean;

  /**
   * Allows temporarily enabling CSS import order warnings to help diagnose precedence errors.
   *
   * @default false
   */
  enableCssOrderWarnings?: boolean;

  /**
   * Entry point configuration.
   */
  entry: Configuration["entry"];

  /**
   * May be used to attach more configuration to that which is generated by createWebpackConfig.
   */
  extendWebpackConfig?: (
    config: WebpackConfigurationWithDevServer,
  ) => WebpackConfigurationWithDevServer;

  /**
   * Name to give webpack compiler instance.
   */
  name?: string;

  /**
   * Array of patterns of files that should not be parsed by webpack.
   */
  noParse?: RegExp | RegExp[];

  /**
   * Use a specific browser (plus arguments) when "skipOpen" is false.
   *
   * The first element of the array should be the browser executable
   * (e.g., "chrome" on Windows, "Google Chrome" on mac OS), and the
   * following elements are optional arguments to pass to the browser
   * executable.
   *
   * If left unset, the default browser will be used.
   *
   * If setting this via the environment variable, note that the value
   * will be passed to `JSON.parse` and should be stored as a stringified
   * array of strings (e.g., `"[\"Google Chrome\"]"`).
   *
   * @example
   *
   * openBrowser: { name: "Google Chrome" } // open Chrome without arguments
   * openBrowser: { name: "Google Chrome", arguments: "--incognito" } // open Chrome in incognito mode
   *
   * $env.WEBPACK_OPEN_BROWSER = '{ name: "google-chrome" }'
   *
   * @default $env.WEBPACK_OPEN_BROWSER || undefined
   */
  openBrowser?: App;

  /**
   * URL to open in the browser when "skipOpen" is false.
   *
   * @default "http://localhost:9000${publicPathRoot}"
   */
  openPage?: string;

  /**
   * Filename or filename template for output files.
   *
   * See http://webpack.github.io/docs/configuration.html#output-filename
   * If "entry" is specified as an array, this must contain an actual filename.
   *
   * @default "[name].js"
   */
  outputFileName?: string;

  /**
   * Output path for bundled files.
   */
  outputPath: string;

  /**
   * Array of plugins to apply with default plugins.
   */
  plugins?: WebpackPluginFunction[];

  /**
   * Port to use when running the dev server.
   *
   * @default 10000
   */
  port?: number;

  /**
   * Root path component for client and server URLs (development).
   *
   * Must begin with a "/" or be "".
   *
   * @example "/SamplePliWeb", "/LandRiteWeb"
   * @default ""
   */
  publicPathRoot?: string;

  /**
   * Root path component for client and server URLs (production).
   *
   * Must begin with a "/" or be "".
   *
   * @example "/ClientA", "/ClientB"
   * @default ""
   */
  publicPathRootRelease?: string;

  /**
   * Array of rules to apply with default rules.
   */
  rules?: RuleSetRule[];

  /**
   * Should a browser window open with the root application page when compilation is finished?
   *
   * NOTE: Dev server only.
   *
   * @default $env.WEBPACK_SKIP_OPEN || false
   */
  skipOpen?: boolean;

  /**
   * Allows temporarily using "style-loader" instead of MiniCssExtractPlugin to help diagnose errors in CSS imports.
   *
   * NOTE: If set in "release" mode, this will throw an error.
   */
  useStyleLoader?: boolean;
}

function createWebpackConfigForMode(
  mode: Configuration["mode"],
  isDevServer: boolean,
  settings: WebpackSettings,
): WebpackConfigurationWithDevServer {
  if (mode !== "production" && mode !== "development") {
    throw new Error(
      `"mode" must be one of "development" or "production". Received: ${JSON.stringify(mode)}.`,
    );
  }
  if (Array.isArray(settings.entry) && !settings.outputFileName) {
    throw new Error('"settings.outputFilename" must be set when "settings.entry" is an array.');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  if ((settings as any).csspackConfig) {
    throw new Error(
      '"settings.csspackConfig" is no longer used. Set "settings.cssMixins" and "settings.cssVariables" instead.',
    );
  }

  const release = mode === "production";

  if (settings.useStyleLoader && release) {
    throw new Error('"settings.useStyleLoader" may not be set when in "release" mode.');
  }

  const {
    appVersion = "0.0.0.0",
    define,
    entry,
    extendWebpackConfig = (config) => config,
    clientHost: host = "localhost",
    port = 10000,
    skipOpen = envIsTrue("WEBPACK_SKIP_OPEN"),
  } = settings;

  const publicPathRoot = (release ? settings.publicPathRootRelease : settings.publicPathRoot) ?? "";
  const virtualPublicPath = `${publicPathRoot}/${settings.outputPath}-${appVersion}/`;

  const cache =
    settings.enableCaching && isDevServer
      ? ({
          type: "filesystem",
        } as FileCacheOptions)
      : false;

  // --- devServer settings ---
  const devServerHost = `http://${host}:${port.toString()}`;
  const devServerPublicPath = `${devServerHost}${virtualPublicPath}`;
  const devServerOpenPage = settings.openPage ?? `http://localhost:9000${publicPathRoot}`;
  const devServer = {
    allowedHosts: "all",
    client: {
      overlay: true,
    },
    devMiddleware: {
      publicPath: devServerPublicPath,
      stats: statsOptions,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
    host,
    hot: true,
    port,
    static: {
      directory: path.join(process.cwd(), virtualPublicPath),

      // defaults to true, but the documentation is currently not very clear about this, so explicitly
      // added for clarification
      watch: true,
    },
  };

  // --- module settings ---
  const cssModulePatterns = settings.cssModulePatterns ?? defaultCssModulePatterns;
  const babelInclude = babelWhitelist
    .concat(settings.babelWhitelist ?? [])
    .map((target) => new RegExp(`[/\\\\]node_modules[/\\\\]${toRegExLiteral(target)}`));
  const extraRules = settings.rules ?? [];
  const rules: RuleSetRule[] = [
    {
      // allow `import someFileName from "someFile.png"`
      test: /\.(png|jpe?g|gif|svg)$/,
      type: "asset/resource",
    },
    {
      // CSS rule
      test: /\.css$/,
      use: [
        settings.useStyleLoader ? "style-loader" : MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            importLoaders: 1, // use following loader (postcss-loader) on imported CSS files
            modules: {
              // only enable CSS modules for appropriate files
              auto: (resourcePath: string) =>
                cssModulePatterns.some((pattern) => pattern.test(resourcePath)),

              // [local] -> always include the real class name in the output class name
              localIdentName: "[local]_[hash:base64:8]",

              // allow using the `import myCss from "my.module.css"` import style
              // the default (namedExport: true) forces the `import * as myCss from "my.module.css"` import style
              namedExport: false,

              // don't adjust the class names for CSS modules
              exportLocalsConvention: "as-is",
            },
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: defaultPostcssPlugins({
                mixins: settings.cssMixins,
                variables: settings.cssVariables,
              }),
            },
          },
        },
      ],
    },
    {
      // babel rule - some 3rd party dependencies ship ES6 code :/
      loader: "babel-loader",
      include: [/\.mjs$/, ...babelInclude],
      options: {
        presets: ["@babel/preset-env"],
        configFile: false, // prevents loading "babel.config.js" files, which might have conflicting settings (currently used in projects for Jest ES module support)
      },
    },
    {
      // typescript rule
      test: /\.tsx?$/,
      loader: "ts-loader",
      options: { silent: true, transpileOnly: true },
    },
    ...extraRules,
  ];

  // --- plugins settings ---
  const extraPlugins = settings.plugins ?? [];
  const plugins: WebpackPluginInstance[] = [
    // values that will be defined globally in application code
    new DefinePlugin({
      DEBUG: JSON.stringify(!release),
      PLI_APP_VERSION: JSON.stringify(appVersion),
      // definitions must be stringified to be replaced literally in bundle output
      ...(define
        ? Object.entries(define).reduce<Record<string, string>>((obj, [key, value]) => {
            obj[key] = JSON.stringify(value);
            return obj;
          }, {})
        : {}),
    }),

    // extract CSS code found during compilation
    new MiniCssExtractPlugin({ ignoreOrder: !settings.enableCssOrderWarnings }),

    // output asset data to "webpack-assets.json" for use by core HTML templates
    // to generate script/style tags
    new AssetsPlugin({
      entrypoints: true,
      fullPath: isDevServer,
      prettyPrint: true,
      useCompilerPath: true,
    }),

    ...extraPlugins,
  ];

  if (isDevServer && !skipOpen) {
    const openBrowserEnv = process.env["WEBPACK_OPEN_BROWSER"];
    const openBrowser = openBrowserEnv ? (JSON.parse(openBrowserEnv) as App) : settings.openBrowser;
    plugins.push(new OpenBrowserPlugin(devServerOpenPage, openBrowser));
  }

  if (release && appVersion) {
    // if application version specified, prepend the version check code
    // to entry bundles
    plugins.push(
      new BannerPlugin({
        banner: getVersionCheckScript(settings.appVersion ?? "0.0.0.0"),
        entryOnly: true,
        raw: true,
        test: "runtime.js",
      }),
    );
  }

  return extendWebpackConfig({
    mode,
    name: settings.name,
    cache,
    context: fs.realpathSync(process.cwd()), // follow any symlinks to ensure sourcemap path accuracy
    devServer,
    devtool: release ? "source-map" : "eval-source-map",
    entry,
    module: {
      rules,
      noParse: settings.noParse,
      // report missing exports as errors instead of warnings
      strictExportPresence: true,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          // disable mangling for better debugging support
          // in production and to reduce compilation time
          terserOptions: { mangle: false },
        }),
        new CssMinimizerPlugin(),
      ],
      runtimeChunk: "single", // allows multiple entry points to be used on a page
      splitChunks: {
        chunks: "all", // extract common dependencies into shared bundles (JS and CSS)
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
      },
    },
    output: {
      devtoolModuleFilenameTemplate: (info: { resourcePath: string }) => {
        const cleanResourcePath = info.resourcePath.replace(/^\.\//, ""); // strip leading "./"
        return `webpack://${settings.publicPathRoot ?? ""}/${cleanResourcePath}`;
      },
      filename: settings.outputFileName ?? "[name].js",
      path: path.join(process.cwd(), settings.outputPath),
      pathinfo: !release,
      publicPath: isDevServer ? devServerPublicPath : virtualPublicPath,
    },
    plugins,
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json", ".css"],

      // Do not follow symlinks when resolving modules.
      // Without this, dependencies of *linked* modules
      // would be resolved by walking up the real path of
      // the module, rather than the linked path.
      //
      // For example:
      // - <dev_root>\SamplePliWeb
      // - <dev_root>\web-pli\dist -> (linked) <dev_root>\SamplePliWeb\src\P.S.W\node_modules\@pandell\classic
      //
      // Without the following setting, require("knockout")
      // in pli/somemodule would be resolved to
      // <dev_root>\web-pli\node_modules\knockout
      // when it should be resolved to the copy in
      // SamplePliWeb.
      symlinks: false,
    },
    resolveLoader: {
      modules: [
        // resolve loaders from local node_modules to ensure loaders
        // are found when this package is linked
        path.join(__dirname, "..", "node_modules"),
        // resolve loaders from web-pli root node_modules
        path.join(__dirname, "..", "..", "..", "node_modules"),
        "node_modules",
      ],
    },
  } as WebpackConfigurationWithDevServer);
}

/**
 * Creates webpack configuration function for the given settings.
 */
export function createWebpackConfig(
  settings: WebpackSettings,
): (
  env: Record<string, string>,
  argv: Record<string, string>,
) => WebpackConfigurationWithDevServer {
  const isDevServer = !!process.env.WEBPACK_SERVE;
  return (_env, argv) =>
    createWebpackConfigForMode(
      isDevServer ? "development" : (argv.mode as Configuration["mode"]) || "production",
      isDevServer,
      settings,
    );
}
