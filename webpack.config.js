const path = require('path');
const func = require('webpack-jw');

let config = {
  entry: {
    'util-common': './src/common/index.js',
    'util': './src/browser/index.js'
  },
  output: {
    libraryTarget: 'umd', //umd
    // umdNamedDefine: true,
    globalObject: 'this', //必须得有它
    path: path.resolve(__dirname, 'release'),
    // filename: 'Q.js'
    library: 'utils'
  }
};

module.exports = func(config);
