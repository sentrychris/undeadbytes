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
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: []
        }
    ]
  }
}