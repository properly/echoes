/*
 *
 *  Echoes - A feedback platform for social marketing.
 *  Copyright (C) 2020 Properly - dani (at) properly.com.br/ola (at) properly.com.br
 *
 *       This program is free software: you can redistribute it and/or modify
 *       it under the terms of the GNU Affero General Public License as published
 *       by the Free Software Foundation, either version 3 of the License, or
 *       (at your option) any later version.
 *
 *       This program is distributed in the hope that it will be useful,
 *       but WITHOUT ANY WARRANTY; without even the implied warranty of
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath()
var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
        { pattern: 'app/index.js', watched: false },
        { pattern: 'test/index.js', watched: false },
    ],
    preprocessors: {
      'app/index.js': ['webpack'],
      'test/**/*.js': ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
    exclude: [],
    reporters: ["dots"],
    // web server port
    port: 8080,
    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    singleRun: false
  });
};
