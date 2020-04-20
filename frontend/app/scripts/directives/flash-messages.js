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

.directive('flashMessages', function(flash, $timeout) {
  return {
    scope: true,
    link: function (scope, element, attr) {
      var subscribeHandle, timeoutHandle;

      scope.flash = {};

      scope.hide = function() {
        scope.flash = {};
        element[0].style.display = 'none';
      }

      function show(message, type) {

        // Hide element if message is empty
        if (message == "") {
          scope.hide();
          return;
        }

        if (timeoutHandle) {
          $timeout.cancel(timeoutHandle);
        }

        scope.flash.type = type;
        scope.flash.message = message;

        // Show element
        element[0].style.display = 'block';

        timeoutHandle = $timeout(scope.hide, 15000);
      }

      subscribeHandle = flash.subscribe(show, attr.flashMessages, attr.id);
    }
  };
});
