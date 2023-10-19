const path = require('path');

module.exports = {
  mode: 'production',
  entry: [
    './src/index.js',
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module:  {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: []
        }
    ]
  }
}