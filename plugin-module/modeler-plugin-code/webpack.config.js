const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CamundaModelerWebpackPlugin = require('camunda-modeler-webpack-plugin');

const LANGUAGE_EXECUTOR_PORT = 12421;

module.exports = [
  {
    mode: 'development',
    entry: './client/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'client/client.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [ 'style-loader', 'css-loader' ]
        },
        { test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/, use: [ 'file-loader' ] }
      ]
    },
    resolve: {
      alias: {
        'react/jsx-runtime': '@bpmn-io/properties-panel/preact/jsx-runtime'
      },
      fallback: {
        'util': false,
        'assert': false,
        'vm': false
      }
    },
    plugins: [
      new DefinePlugin({
        'process.env.LANGUAGE_EXECUTOR_PORT': '' + LANGUAGE_EXECUTOR_PORT
      }),
      new CamundaModelerWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: 'style/style.css',
            to: 'assets/styles'
          },
          {
            from: 'node_modules/codemirror/lib/codemirror.css',
            to: 'assets/styles'
          },
          {
            from: 'node_modules/codemirror/theme/material.css',
            to: 'assets/styles'
          },
          {
            from: 'node_modules/codemirror/addon/hint/show-hint.css',
            to: 'assets/styles'
          },
          {
            from: 'node_modules/codemirror/addon/lint/lint.css',
            to: 'assets/styles'
          },
          {
            from: 'node_modules/codemirror/addon/dialog/dialog.css',
            to: 'assets/styles'
          },
          {
            from: 'node_modules/react-reflex/styles.css',
            to: 'assets/styles/react-reflex.css'
          },
          {
            from: path.resolve(__dirname, './index.prod.js'),
            to: path.resolve(__dirname, './dist/index.js')
          }
        ]
      })
    ],
    devtool: 'cheap-module-source-map'
  },
  {
    mode: 'development',
    entry: './backend/main.js',
    target: 'node',
    node: {
      __dirname: false
    },
    output: {
      path: path.resolve(__dirname, 'dist/backend'),
      filename: 'main.js',
      libraryTarget: 'commonjs2'
    },
    plugins: [
      new DefinePlugin({
        'process.env.LANGUAGE_EXECUTOR': 'path.resolve(__dirname, \'../assets/language-executor.jar\')',
        'process.env.LANGUAGE_EXECUTOR_PORT': '' + LANGUAGE_EXECUTOR_PORT
      })
    ]
  }
];