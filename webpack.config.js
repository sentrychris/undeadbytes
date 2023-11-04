const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: [
    './src/browser/index.js',
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: true,
    })],
  },
  module:  {
    rules: [
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                url: false,
              }
            },
          ]
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
          { from: './src/shared/assets' },
          {
            from: './src/shared/assets/img/favicon.ico',
            to: './favicon.ico'
          },
          { from: './src/browser/views'}
      ]
    })
  ]
}