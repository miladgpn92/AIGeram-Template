const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/ts/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    
    new HtmlWebpackPlugin({
        template: './src/login.html',
        filename: 'login.html'
    }),
    new HtmlWebpackPlugin({
        template: './src/otp.html',
        filename: 'otp.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/images', to: 'images' }
      ]
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
}; 