const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');
const path = require('path');
const util = require('util');
const {
  ie,
  type: fusionBuildType,
  excludedComponents,
  backwardCompatibilityComponents,
} = require('../../fusion.json');

const buildType = process.env.FUSION_BUILD_TYPE || fusionBuildType;
const protocol = process.env.PROTOCOL || 'http';
const editorPort = +process.env.EDITOR_PORT || 5002;
const fusionLazy = process.env.FUSION_LAZY;
const readdir = util.promisify(fs.readdir);
const buildMode = process.env.BUILD_MODE;

/**
 * Components config with folder structure, prefixes etc.
 * @typedef {Object} componentsConfig
 * @property {Object} fusion - standard components storage
 * @property {Object} customComponents - custom components storage
 * @property {string} prefix - possible components prefix
 * @property {string} folder - custom components storage
 */
const componentsConfig = {
  fusion: {
    folder: 'fusion',
    types: {
      slide: {
        prefix: 'fusion-',
      },
      brief: {
        prefix: 'fusion-',
      },
      email: {
        prefix: 'mj-',
      },
    },
  },
  customComponents: {
    folder: 'components',
    types: {
      slide: {
        prefix: '',
      },
      brief: {
        prefix: '',
      },
      email: {
        prefix: '',
      },
    },
  },
};

let subfolderPaths = [];
/**
 *
 * @param {string} area - Correct component area. Standard or custom
 * @param {string} type - Correct component type. Slide or email
 * @param {componentsConfig] config - Global component config
 * @returns {string} Correct path to folder
 */
const getFolder = (area, type, config) => {
  const root = 'src';
  const areaFolder = config[area].folder;
  return path.join(root, areaFolder, type);
};
const getAreas = (config) => Object.keys(config);
const getTypes = (area) => Object.keys(area.types);
const getPrefix = (area, type) => area.types[type].prefix;

function fillStructureForAllType(config, area, includedComponents) {
  getTypes(config[area]).forEach((type) => {
    includedComponents[area].types[type] = [];
  });
}

/**
 * Setup correct types for build.
 * @returns {object} included components list
 */
const fillStructure = (config) => getAreas(config)
  .reduce((setup, area) => {
    setup[area] = {
      types: {},
    };
    if (buildType === 'all') {
      fillStructureForAllType(config, area, setup);
    } else {
      setup[area].types[buildType] = [];
    }
    return setup;
  }, {});

/**
 * Get filtered list of components. List without excluded components
 * @param {string} area - Correct component area. Standard or custom
 * @param {string} type - Correct component type. Slide or email
 * @param {componentsConfig} config - Global components config
 * @returns {[string]} list without excluded components
 */
const filterComponentList = async (area, type, config) => {
  const folder = getFolder(area, type, config);
  const excludedComponentsList = excludedComponents[area][type];
  let components = [];
  if (fs.existsSync(folder)) {
    components = (await readdir(folder))
      .filter((file) => (!excludedComponentsList
        .some((component) => component === `${getPrefix(config[area], type)}${file}`)));
  }
  return components;
};

async function filterByArea(includes, area) {
  // eslint-disable-next-line no-restricted-syntax
  for (const type of getTypes(includes[area])) {
    // eslint-disable-next-line no-await-in-loop
    includes[area][type] = await filterComponentList(area, type, componentsConfig);
  }
  return includes;
}

/**
 * get included components to build
 * @returns {Promise<array>} List of components
 */
const getIncludedComponents = async () => {
  const includes = fillStructure(componentsConfig);
  // eslint-disable-next-line no-restricted-syntax
  for (const area of getAreas(includes)) {
    // eslint-disable-next-line no-await-in-loop
    await filterByArea(includes, area);
  }
  return includes;
};

/**
 * Replace webpack dynamic regExp via plugin ContextReplacementPlugin
 * @param {object} context - object that we should MUTUAL and update
 * @param {string} area - Correct component area. Standard or custom
 * @param {string} type - Correct component type. Slide or email
 * @param {object} includes - Components includes components for every are and type
 */
const replaceRegExp = (context, area, type, includes) => {
  const folder = getFolder(area, type, componentsConfig);
  const request = fs.existsSync(folder) ? context.request : './';
  const includedNames = includes[area][type];
  const includedRegEx = (includedNames && includedNames.length && fs.existsSync(folder)) ? `/(${includedNames.join('|')})` : '(?!.)';
  const regExp = new RegExp(`${includedRegEx}/([^/]+/)*index.js$`);
  Object.assign(context, {
    regExp,
    request,
  });
};

const listFolderNames = async (folder) => {
  let folders = [];
  if (fs.existsSync(folder)) {
    folders = (await readdir(folder, { withFileTypes: true }))
      .filter((file) => file.isDirectory())
      .map((file) => file.name);
  }
  return folders;
};

const getFragments = async () => {
  const folder = 'fragments';
  return listFolderNames(folder);
};

const getFilesFromDirectory = async (folder, component, prefix) => {
  if (fs.existsSync(folder)) {
    if (fs.existsSync(`${folder}/index.js`)) {
      const item = {
        path: folder,
        component: `${prefix}${component}`,
        backwardCompatibilityComponent: backwardCompatibilityComponents ? `${backwardCompatibilityComponents[component]}` : '',
      };
      subfolderPaths.push(item);
    }
    if (fs.lstatSync(folder).isDirectory()) {
      fs.readdirSync(folder, { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map(async (file) => {
          const subfolder = `${folder}/${file.name}`;
          await getFilesFromDirectory(subfolder, file.name, prefix);
        });
    }
  } else {
    // eslint-disable-next-line
    console.log(folder, 'is not exist', 'Webpack.config');
  }
};

const getCustomPath = (area, type) => {
  const configType = area === 'fusion' ? 'fusion' : 'customComponents';
  const { folder } = componentsConfig[configType];
  return `src/${folder}/${type}`;
};

const getComponentsPath = (includes) => {
  const areas = getAreas(includes);
  areas.forEach((area) => {
    const types = getTypes(includes[area]);
    types.forEach((type) => {
      const customPath = getCustomPath(area, type);
      includes[area][type].forEach(async (rootComponent) => {
        const prefix = area === 'fusion' ? 'fusion-' : '';
        await getFilesFromDirectory(`${customPath}/${rootComponent}`, rootComponent, prefix);
      });
    });
  });
  return [];
};

const getEntryFile = () => {
  let file = ['./src/main.js'];
  if (process.env.FUSION_BUILD_TYPE === 'email') {
    file = ['./src/email-main.js'];
  } else if (process.env.BUILD_MODE === 'prod' && process.env.FUSION_LAZY === 'lazy') {
    file = ['./src/main-lazy.js', './src/main-oce.js'];
  } else if (process.env.BUILD_MODE === 'prod') {
    file = ['./src/main.js', './src/main-oce.js'];
  } else if (process.env.FUSION_LAZY === 'lazy') {
    file = ['./src/main-lazy.js'];
  }
  return file;
};

const getOutputConfig = (configs) => {
  const {
    activatorConfig,
    prodDifference,
    lazyDifference,
    lazyProdDifference,
  } = configs;
  let output = activatorConfig;
  if (process.env.BUILD_MODE === 'prod') {
    output = { ...activatorConfig, ...prodDifference };
  }
  if (process.env.FUSION_LAZY === 'lazy') {
    output = { ...activatorConfig, ...lazyDifference };
  }
  if (process.env.BUILD_MODE === 'prod' && process.env.FUSION_LAZY === 'lazy') {
    output = { ...activatorConfig, ...prodDifference, ...lazyProdDifference };
  }
  return output;
};

module.exports = async (env, argv) => {
  const { mode = 'development', port } = argv;
  const isProduction = !!(mode && mode === 'production');
  subfolderPaths = [];
  const defaultBrowsers = ['last 2 Chrome versions', 'last 2 Firefox versions', 'last 2 iOS versions'];
  const targetBrowsers = ie ? [...defaultBrowsers, 'IE 11'] : defaultBrowsers;
  const includes = await getIncludedComponents();
  const fragments = await getFragments();
  await getComponentsPath(includes);
  const activatorConfig = {
    target: 'web',
    entry: {
      main: getEntryFile(),
    },
    output: {
      filename: '[name].js',
      clean: true,
    },
    mode,
    // from https://gist.github.com/mburakerman/629783c16acf5e5f03de60528d3139af
    module: {
      rules: [
        {
          test: /\.m?js$/,
          // exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: { browsers: targetBrowsers },
                }],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          }],
        },
        {
          test: /\.(png|jpg|jpeg)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          }],
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: false,
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.DEFINED_FRAGMENTS': JSON.stringify(fragments),
        'process.env.FUSION_BUILD_TYPE': JSON.stringify(buildType),
        'process.env.FUSION_LAZY': JSON.stringify(fusionLazy),
        'process.env.COMPONENTS_PATH': JSON.stringify(subfolderPaths),
        'process.env.BUILD_MODE': JSON.stringify(buildMode),
        'process.env.PROTOCOL': JSON.stringify(protocol),
        'process.env.EDITOR_PORT': JSON.stringify(editorPort),
      }),
      new webpack.ContextReplacementPlugin(/\.\/slide/, (context) => {
        replaceRegExp(context, 'fusion', 'slide', includes);
      }),
      new webpack.ContextReplacementPlugin(/\.\/email/, (context) => {
        replaceRegExp(context, 'fusion', 'email', includes);
      }),
      new webpack.ContextReplacementPlugin(/components\/slide/, (context) => {
        replaceRegExp(context, 'customComponents', 'slide', includes);
      }),
      new webpack.ContextReplacementPlugin(/components\/email/, (context) => {
        replaceRegExp(context, 'customComponents', 'email', includes);
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new ESLintPlugin(),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    watch: !isProduction,
    devServer: {
      port,
      inline: false,
      https: protocol === 'https',
      writeToDisk: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type',
      },
    },
  };
  const lazyDifference = {
    entry: {
      main: getEntryFile(),
      activator: ['./src/fusion/activator.js'],
    },
  };
  const lazyProdDifference = {
    entry: {
      ['main-prod']: getEntryFile(),
      activator: ['./src/fusion/activator.js'],
    },
  };
  const prodDifference = {
    entry: {
      ['main-prod']: getEntryFile(),
    },
    output: {
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          // exclude: /(node_modules)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: { browsers: targetBrowsers },
                }],
              ],
            },
          },
          {
            loader: 'webpack-strip-block',
            options: {
              start: 'activatorOnly:start',
              end: 'activatorOnly:end',
            },
          }],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          }],
        },
        {
          test: /\.(png|jpg|jpeg)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          }],
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: false,
            },
          },
        },
      ],
    },
  };
  const configObj = {
    activatorConfig,
    prodDifference,
    lazyDifference,
    lazyProdDifference,
  };
  return getOutputConfig(configObj);
};
