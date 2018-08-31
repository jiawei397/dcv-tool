const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var libraryName = 'utils';

module.exports = {
  // entry:'./src/index.js',
  entry:{
    'utils': './src/common/index.js',
    'utils-brow': './src/browser/index.js',
    'utils-node': './src/node/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
        root: path.resolve(__dirname, '../'),    // 设置root
        verbose: true
      })
    // new webpack.ProvidePlugin({
    //   bluebird: 'bluebird'
    // })
  ],
  externals: {
    bluebird: "bluebird"
  },
  output: {
    publicPath: '/',
    chunkFilename: '[name].js',
    // filename: 'utils.js',
    filename: '[name].js',
    // chunkFilename: '[name].[hash].js',
    // filename: '[name].[hash].js',
    library: libraryName,   //不要设置libraryName就行了
    // libraryTarget: 'this',//umd
    libraryTarget: 'umd',//umd
    // umdNamedDefine: true,
    globalObject: 'this',//必须得有它
    path: path.resolve(__dirname, '../dist'),
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
