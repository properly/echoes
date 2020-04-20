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
  .filter('t', function(translateFilter, $log) {
  var translate = translateFilter;

  function getCount(args) {
    if (_.isObject(args) && _.has(args, 'count')) {
      return args['count'] || 0;
    }
  }

  return function(input, args) {
    var key,
      count = getCount(args);
    if (!_.isNumber(count)) {
      return translate(input, args);
    }

    switch (count) {
      case 0:
        key = "zero"
        break;
      case 1:
        key = "one"
        break;
      default:
        key = "other"
    }

    return translate(input + '.' + key, args);
  };
});
