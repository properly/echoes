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
 * @ngdoc directive
 * @name echoesApp.directive:clientUserAssign
 * @description
 * # clientUserAssign
 */
angular.module(
  'echoesApp'
).directive('clientUserAssign', function() {
  return {
    templateUrl: 'views/clients/_user-assign.html',
    restrict: 'A',
    controller: function($scope, CurrentUser, User) {
      $scope.currentUser = CurrentUser;

      var unregisterWatch = $scope.$watch('editUsers', function(open) {
        if (!open) {
          return;
        }

        $scope.users = User.available({
          client_id: $scope.client.id
        });

        unregisterWatch();
      });

      $scope.users = [];

      $scope.assignUser = function(user, client) {
        user.$addToClient({
          client_id: client.id
        });
      };

      $scope.togglePermission = function(e, user, client) {
        e.preventDefault();
        e.stopPropagation();

        if (user.has_permission) {
          user.$removeFromClient({
            client_id: client.id
          });
        }

        if (!user.has_permission) {
          user.$addToClient({
            client_id: client.id
          });
        }
      };
    }
  };
});
