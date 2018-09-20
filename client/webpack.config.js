'use strict';

const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const fs = require('fs');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(
  fs.readFileSync(path.join(__dirname, '../client/style/antdCustomThemeVars.less'), 'utf8'),
);
// lessToJs does not support @icon-url: "some-string", so we are manually adding it to the produced themeVariables js object here
// themeVariables["@icon-url"] = "'//localhost:8080/fonts/iconfont'";
themeVariables['@icon-url'] = '../public/fonts/iconfont';

const production = process.env.NODE_ENV === 'production';

const config = {
  context: path.resolve(__dirname),
  entry: {
    dashboard: './dashboard.tsx',
  },
  output: {
    path: path.resolve(__dirname, '..', 'server', 'public', 'dashboard'),
    filename: `[name].js`,
    publicPath: '/static/dashboard/',
  },
  devServer: {
    contentBase: '.',
    port: 3001,
  },
  stats: {},
  //https://github.com/webpack/webpack/issues/939#issuecomment-89476095
  resolveLoader: {
    //root: path.join(__dirname, "node_modules")
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(js)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            // passPerPreset: true,
            babelrc: false,
            // modules: false disable transpiling es6 modules, as webpack2 can work with es6 modules
            presets: [
              [
                '@babel/env',
                {
                  targets: {
                    browsers: ['last 2 versions', 'Firefox ESR', 'not ie < 11'],
                  },
                  debug: false,
                  modules: false, // default commonjs
                  useBuiltIns: 'entry',
                },
              ],
              '@babel/react',
              '@babel/typescript',
            ],
            plugins: [
              'babel-plugin-syntax-object-rest-spread',
              'babel-plugin-transform-class-properties',
              ['import', { libraryName: 'antd', style: true }],
              /*'babel-plugin-transform-decorators-legacy',
              'babel-plugin-transform-object-rest-spread',
              'babel-plugin-syntax-object-rest-spread',
              'babel-plugin-transform-class-properties',
              'babel-plugin-syntax-dynamic-import',*/
              // require.resolve('../pl-common/utils/babel/babelDataTest'),
              /*['relay', { schema: 'schema/user.json' }],*/
            ],
          },
        },
      },
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true, modifyVars: themeVariables },
          },
        ],
      },
      {
        test: /\.lessx$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: '@jpavon/typings-for-css-modules-loader',
            options: {
              modules: true,
              importLoaders: 1,
              // namedExport: true,
              localIdentName: '[name]__[local]',
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|gif|jpg)$/,
        use: 'file-loader?name=img/[name].[ext]', //loader: "url-loader?name=img/[name].[ext]&limit=8192"
      },
      {
        test: /\.(pdf)$/,
        use: 'file-loader?name=pdf/[name].[ext]',
      },
      {
        test: /\.(otf|ttf|eot|woff)$/,
        use: 'file-loader?name=fonts/[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
  ],
  /*new CopyWebpackPlugin(
      [
        { from: path.join(__dirname, 'img'), to: 'img' },
        { from: path.join(__dirname, '../pl-common/style/fonts'), to: 'fonts' },
      ],
      {},
    ),*/

  /*new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),]*/
};

module.exports = config;
