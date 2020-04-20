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
 * @name echoesApp.directive:inviteUserForm
 * @description
 * # inviteUserForm
 */
angular.module(
  'echoesApp'
).directive('inviteUserForm', function() {
  return {
    templateUrl: 'views/invitations/_invitation-form.html',
    restrict: 'A',
    scope: {
      users: '=',
      addedCallback: '=',
      organization: '=',
      client: '=',
    },
    controller: function($scope, $filter, User, flash) {
      $scope.user = new User();

      $scope.invite = function() {
        $scope.user.$invite({
          organization_id: $scope.organization.id
        }, function(user) {
          if (user.id) {
            if (angular.isFunction($scope.addedCallback)) {
              $scope.addedCallback(user, $scope.client);
            }

            // Mailer is slower than pusher, so check that we're not double adding,
            // it's also possible to re-send an invite with the same action, don't
            // double add.
            var userExists = _.find($scope.users, function(member) {
              return member.id == user.id
            });

            if (!userExists) {
              $scope.users.push(user);
            }
          }
        }, function(response) {
          $scope.user.email = "";
          flash.error = response.data;
        });

        $scope.user = new User();
      }
    }
  }
});
