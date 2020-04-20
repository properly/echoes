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
  .directive('scheduledAt', function() {
    return {
      restrict: 'A',
      scope: {
        post: '=scheduledAt'
      },
      templateUrl: 'views/posts/_datepicker.html',
      link: function (scope, element, attrs) {
        // Set scheduled_date and scheduled_time from scheduled_at
        scope.$watch('post.scheduled_at', function(scheduledAt) {
          if (!scheduledAt || scope.post.scheduled_time || _.isString(scheduledAt))
            return;

          // garantees that scheduled_at is a moment object
          scope.post.scheduled_at = moment(scope.post.scheduled_at);

          scope.post.scheduled_time = scheduledAt.format('HH:mm');
          scope.post.scheduled_date = scheduledAt;
        });

        // Update scheduled_at if time has changed
        scope.$watch('post.scheduled_time', function(scheduledTime, old) {
          if (!scheduledTime || scheduledTime == old || scheduledTime.indexOf(':') < 0)
            return;

          var timeArr = scheduledTime.split(":");
          scope.post.scheduled_at = scope.post.scheduled_at.hour(timeArr[0]).minute(timeArr[1]);
        });

        // Update scheduled_at if date has changed
        scope.$watch('post.scheduled_date', function(scheduledDate, old) {
          if (!scheduledDate || scheduledDate == old) return;

          // Value can be a Date object
          scheduledDate = moment(scheduledDate);

          scope.post.scheduled_at = scope.post.scheduled_at
            .date(scheduledDate.date())
            .month(scheduledDate.month())
            .year(scheduledDate.year());
        });
      }
    };
  });
