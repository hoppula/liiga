var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "eval",
  entry: [
    "webpack-hot-middleware/client",
    "webpack/hot/only-dev-server",
    "./client.coffee"
  ],
  output: {
    path: path.join(__dirname, "public"),
    filename: "app.js",
    publicPath: "/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ["", ".js", ".coffee"]
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loader: "coffee",
        query: { transpile: { presets: ["es2015", "react"] } },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      { test: /\.png$/, loader: "url?limit=10000" },
      { test: /\.svg$/, loader: "file" },
      {
        test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file"
      }
    ]
  }
};
