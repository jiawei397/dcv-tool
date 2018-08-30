const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var libraryName = 'utils';

module.exports = {
  entry:'./src/index.js',
  plugins: [
    new CleanWebpackPlugin(['../dist']),
    new webpack.ProvidePlugin({
      P: 'bluebird'
    })
  ],
  output: {
    publicPath: '/',
    chunkFilename: '[name].js',
    filename: 'utils.js',
    // chunkFilename: '[name].[hash].js',
    // filename: '[name].[hash].js',
    library: libraryName,   //不要设置libraryName就行了
    libraryTarget: 'this',//umd
    // umdNamedDefine: true,
    path: path.resolve(__dirname, '../dist')
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|glf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      {
        test: /\.js$/,
        use:{
          loader: 'babel-loader',
        },
        exclude: /node_modules/
      }
    ]
  }
};
