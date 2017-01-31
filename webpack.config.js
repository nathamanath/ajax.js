var path = require('path');
var webpack = require("webpack");

module.exports = {
  entry: './src/wrapper.js',

  output: {
    filename: 'ajax.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    })
  ],

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
