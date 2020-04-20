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
  .service('GoodGreeting', function() {
    function inRange(start, time, end) {
      var startTime = moment(start, 'HH:mm'),
        endTime = moment(end, 'HH:mm'),
        timestamp = moment(time, 'HH:mm');

      return (moment(startTime, 'HH:mm').diff(timestamp) < 0) && (moment(endTime, 'HH:mm').diff(timestamp) > 0);
    };

    var GoodGreeting = {
      bodyClass: function(time) {
        if (inRange('00:20', time, '10:20'))
          return 'good-morning';

        if (inRange('10:20', time, '14:20'))
          return 'good-day';

        if (inRange('14:20', time, '19:00'))
          return 'good-afternoon';

        return 'good-night';
      }
    };


    return GoodGreeting;
  });
