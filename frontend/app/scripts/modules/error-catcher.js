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

angular.module('errorCatcher', [])

// Exceptions thrown in code
.factory('$exceptionHandler', function($log) {
  return function errorCatcherHandler(exception, cause) {
    $log.error(exception.stack);
  };
})


// HTTP Errors
.factory('errorHttpInterceptor', function($q) {
  var validErrors = [401, 402, 403, 404, 422];
  var blacklist = [/password/, /cvv/, /card_number/, /expiration_month/, /expiration_year/, /XSRF/];

  function sanitize(obj) {
    _.reject(obj, function(val, key, list) {
      var blacklistMatches = _.filter(blacklist, function(regexp) {
        return regexp.test(key);
      })

      if (blacklistMatches.length > 0) obj[key] = '** Filtered **';
    });

    return obj;
  }

  function recursiveSanitize(object) {
    _.each(object, function(val, i) {
      if (!_.isObject(object[i])) return;

      recursiveSanitize(object[i]);
      sanitize(object[i]);
    });

    return sanitize(object);
  }

  return {
    responseError: function responseError(rejection) {
      // Don't capture known "valid" errors
      if (validErrors.indexOf(rejection.status) !== -1)
        return $q.reject(rejection);

      return $q.reject(rejection);
    }
  };
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('errorHttpInterceptor');
});
