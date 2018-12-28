const webpack = require('webpack');
const mode = require('yargs').argv.mode;
const libraryTarget = require('yargs').argv['output-library-target'];
const pkg = require('./package.json');
const nodeExternals = require('webpack-node-externals')

const libraryName = 'agent';

const banner = `${pkg.name}
${pkg.description}\n
@version v${pkg.version}
@author ${pkg.author}
@homepage ${pkg.homepage}
@repository ${pkg.repository.url}`

const plugins = [
    new webpack.BannerPlugin(banner)
];

module.exports = {
    entry: `${__dirname}/index.js`,
    devtool: 'source-map',
    output: {
        path: `${__dirname}/${libraryTarget === 'umd' ? 'dist' : 'lib'}`,
        filename: mode === 'development' ? `${libraryName}.js` : `${libraryName}.min.js`,
        library: libraryName,
        libraryTarget: libraryTarget || 'umd',
        globalObject: '(typeof self !== \'undefined\' ? self : this)', // TODO Hack (for Webpack 4+) to enable create UMD build which can be required by Node without throwing error for window being undefined (https://github.com/webpack/webpack/issues/6522)
        umdNamedDefine: true
    },
    resolve: {
        // root: [`${__dirname}/src`],
        modules: [`${__dirname}/src`, 'node_modules']
    },
    target: 'node',
    plugins: plugins,
    // externals: [nodeExternals({whitelist: []})],
}
