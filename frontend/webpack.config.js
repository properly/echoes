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

const webpack = require("webpack");
const path = require("path");
const assetFunctions = require("node-sass-asset-functions");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: "./app/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "bower_components")],
    alias: {
      ngRoute: "angular-route",
      ngResource: "angular-resource",
    },
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|svg|woff2?|png|jpg|gif)/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /app\/*.js$/,
        exclude: /node_modules/,
        use: [{ loader: "ng-annotate-loader" }],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: {
              functions: assetFunctions({
                images_path: "./app/images",
              }),
              includePaths: [
                path.resolve(__dirname, "./node_modules/compass-mixins/lib"),
                path.resolve(
                  __dirname,
                  "./node_modules/breakpoint-sass/stylesheets"
                ),
              ],
            },
          },
        ],
      },
      {
        test: require.resolve("angular"),
        use: {
          loader: "exports-loader",
          options: "window.angular",
        },
      },
      {
        test: require.resolve("moment"),
        use: [{ loader: "expose-loader?moment" }],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: 'app/index.html', to: 'index.html' },
      { from: 'app/views', to: 'views' },
      { from: 'app/images', to: 'images' },
    ]),

    new webpack.ProvidePlugin({
      ActionCable: "actioncable",
      _: "underscore",
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
  ],
  watchOptions: {
    ignored: [/node_modules/, /bower_components/],
  },
};
