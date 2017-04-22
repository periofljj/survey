var webpack = require('webpack');
var path = require('path');

module.exports = function(minimize) {
    var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

    var plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ];
    var outputFile = 'bundle.js';
    var outputPath = path.join(__dirname, "public");
    var devtool = "source-map";

    if (minimize) {
        /* minification */
        plugins.push(new UglifyJsPlugin({
            minimize: true,
            mangle: true
        }));
        outputFile = 'main.min.js';
        devtool = null;
    }

    return {
        entry: './client/main.js',
        debug: true,
        devtool: devtool,
        output: {
            path: outputPath,
            filename: outputFile,
        },
        module: {
            loaders: [{
                test: /\.html$/,
                loader: 'raw',
                exclude: /node_modules/
            }]
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        plugins: plugins
    };
};
