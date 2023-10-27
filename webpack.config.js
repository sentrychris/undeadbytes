const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [
    './src/browser/index.js',
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module:  {
    rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: []
        }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
          { from: './src/browser/assets' },
          { from: './src/browser/views'}
      ]
    })
  ]
}