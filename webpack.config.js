var path = require('path');
var webpack = require("webpack");

var env = process.env.WEBPACK_ENV;
var plugins = []

if (env === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  outputFile = 'ajax.min.js';
} else {
  outputFile = 'ajax.js';
}

module.exports = {
  entry: './src/wrapper.js',

  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library: 'Ajax',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  plugins: plugins,

  // devtool: 'source-map',

  module: {
    loaders: [
      {
        test:/\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }

};
