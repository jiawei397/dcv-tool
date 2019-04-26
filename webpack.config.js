const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'util-common': './src/common/index.ts',
    'util': './src/browser/index.ts'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'index',
  //     filename: 'index.html',
  //     template: 'src/html/pageA.html'
  //     //   chunks: ['app'],
  //   })
  // ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    libraryTarget: 'umd', //umd
    // umdNamedDefine: true,
    globalObject: 'this', //必须得有它
    path: path.resolve(__dirname, 'release'),
    // filename: 'Q.js'
    library: 'utils'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    hot: true
  }
};
