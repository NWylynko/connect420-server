require('dotenv').config()
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV || 'production',
  watch: process.env.NODE_ENV === 'development',
  devtool: process.env.NODE_ENV === 'development' && 'inline-source-map',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ],
        exclude: /node_modules/,
      }
    ]
  },
  externals: [ nodeExternals() ],
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: process.env.NODE_ENV === 'development' && ['yarn watch']
    })
  ]
}