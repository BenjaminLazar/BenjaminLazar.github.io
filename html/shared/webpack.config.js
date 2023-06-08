const getFusionConfig = require('./src/fusion/webpack.config.js');

module.exports = async (env, argv) => {
  const fusionConfig = await getFusionConfig(env, argv);
  return {
    ...fusionConfig,
    // Add extensions to the base config below
  };
};
