// razzle.config.js
const path = require('path');

const root = path.resolve(__dirname, '.', 'node_modules');
module.exports = {
    modifyWebpackConfig({ webpackConfig }) {
        webpackConfig.resolve.alias = {
            ...webpackConfig.resolve.alias,
        };
        return webpackConfig;
    },
};
