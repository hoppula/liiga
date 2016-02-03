var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  devtool: 'source-map',
  entry: [
    './client.coffee'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("css/styles.css")
  ],
  resolve: {
    extensions: ["", ".js", ".coffee"]
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loaders: ["coffee", "cjsx"]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!less')
      },
      { test: /\.png$/, loader: "url?limit=10000" },
      { test: /\.(jpg|svg)$/, loader: "file?name=../[path][name].[ext]" },
      {
        test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file?name=../[path][name].[ext]"
      }
    ]
  }
};
