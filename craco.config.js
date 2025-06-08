module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add a rule to ignore test files
      webpackConfig.module.rules.push({
        test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
        use: 'ignore-loader',
      });

      return webpackConfig;
    },
  },
};
