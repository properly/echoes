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

/**
 * @ngdoc service
 * @name echoesApp.eventsIndexer
 * @description
 * # eventsIndexer, indexes an array according to specified timestamp attribute
 *
 * Service in the echoesApp.
 */
angular.module('echoesApp')
  .service('eventsIndexer', function eventsIndexer($rootScope) {
    // @param [Object] containing events: Array, timestamp: String
    // @return [Object] with splitByHour and between
    return function(args) {
      // Validates that args is present
      if (typeof args !== 'object') {
        throw new Error('eventIndexer needs to be instanciated with an object as argument');
      }

      var events = args['events'];
      var ts = args['timestamp'];
      var splitMap = new Object;

      if (!Array.isArray(events)) {
        throw new Error('missing events array in arguments');
      }

      if (typeof ts !== 'string') {
        throw new Error('missing timestamp argument');
      }

      // Round a timestamp to the full hour, never goes forward
      //
      // @param [String] ISO timestamp string
      // @return [String] ISO timestamp string
      function toWholeHour(ts) {
        return moment(ts).startOf('hour').toISOString()
      }

      // Split array by hour and index them onto the splitMap object
      //
      // @return [Void]
      function byHour() {
        // Empty the splitMap instead of overwriting it to
        // ensure it changes in other scopes as well
        for (var prop in splitMap) {
          if (splitMap.hasOwnProperty(prop)) {
            delete splitMap[prop];
          }
        }

        _.each(events, function(evt) {
          var key = toWholeHour(evt[ts]);

          // add events to the splitMap
          splitMap[key] ?
            splitMap[key].push(evt) :
            splitMap[key] = new Array(evt);
        });
      }

      // Add callbacks to the events array: push, splice and pop
      events.push = function() {
        Array.prototype.push.apply(this, arguments);
        byHour();
      }

      events.splice = function() {
        Array.prototype.splice.apply(this, arguments);
        byHour();
      }

      events.pop = function() {
        Array.prototype.pop.apply(this, arguments);
        byHour();
      }

      // Init
      byHour();

      return {
        splitByHour: function() {
          return splitMap;
        },
        between: function(start, end) {
          if (!moment(start).isValid() || !moment(end).isValid()) {
            throw new Error('start or end date string is invalid');
          }
          // Ensure that the start/end are properly formatted
          var start = moment(start).toISOString();
          var end = moment(end).toISOString();

          var inRange = new Object();

          // filter string between start and end
          for (var key in splitMap) {
            if ((key >= start) && (key <= end)) {
              inRange[key] = splitMap[key];
            }
          }

          return inRange;
        }
      }
    }
  });
