'use strict';
var path = require('path');
var absoluteBasePath = path.resolve(__dirname);

// var coverage = process.env.COVERAGE;
// var suite = coverage ? 'test/all.js' : 'test/suite.js';

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
var browsers =
  (process.env.TEST_BROWSERS || 'ChromeHeadless')
    .replace(/^\s+|\s+$/, '')
    .split(/\s*,\s*/g)
    .map(function(browser) {
      if (browser === 'ChromeHeadless') {
        process.env.CHROME_BIN = require('puppeteer').executablePath();
      }

      return browser;
    });

var suite = 'test/suite.js';


module.exports = function(karma) {
  karma.set({

    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    files: [
      suite
    ],

    preprocessors: {
      [suite]: [ 'webpack' ]
    },

    reporters: [ 'progress' ],

    browsers: browsers,

    autoWatch: false,
    singleRun: true,

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react']
              }
            }
          },
          {
            test: /\.(css|bpmn)$/,
            use: 'raw-loader'
          },
          {
            test: /\.png$/,
            use: 'url-loader'
          }
        ]
      },
      resolve: {
        mainFields: [
          'dev:module',
          'browser',
          'module',
          'main'
        ],
        modules: [
          'node_modules',
          absoluteBasePath
        ]
      }
    }
  });
};
