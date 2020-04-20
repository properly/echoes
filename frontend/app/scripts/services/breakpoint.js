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

'use strict';

angular.module('echoesApp')

.service('Breakpoint', function($window) {

        var bps = [];

        var Breakpoint = {
          xsmall: 320,
          small: 464,
          medium: 672,
          large: 960,
          xlarge: 1280,
          /* Sets a interval for window width. If current width within this interval,
           * run callback function
           *
           * @param [integer] lower breakpoint
           * @param [integer] upper breakpoint
           */
          add: function(from, to, callback) {
            if (arguments.length === 2) {
              callback = to;
              to = undefined;
            }

            bps.push({
              from: from,
              to: to,
              callback: callback
            });

            applyBp(_.last(bps));
          }
        };

        /* Check if breakpoint is within limit and run respective callback
         *
         */
        function applyBp(bp) {
          var windowWidth = $window.innerWidth;

          if (bp.from <= windowWidth && (!bp.to || bp.to > windowWidth)) {
            bp.callback(windowWidth);
          }
        }

        /* Listen to resize event to update breakpoint if needed
         *
         */
        angular.element($window).resize(_.debounce(function() {
          _.each(bps, function(bp) {
            applyBp(bp);
          })
        }, 200));

    return Breakpoint;
  }
);
