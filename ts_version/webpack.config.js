const path = require('path');
// webpack.config.js
module.exports = {
    mode: 'production', // Use 'production' for a minimized build
    entry: {
        content: './src/content.ts',
        background: './src/background.ts',
        popup: './src/popup.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    // devtool: 'eval',  <-- REMOVE or COMMENT OUT this line
  //  devtool: 'cheap-module-source-map', // Or a similar non-eval devtool for development
};