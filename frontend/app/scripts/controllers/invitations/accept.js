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

.controller('InvitationsAcceptCtrl', function(
  $scope,
  $routeParams,
  $location,
  flash,
  Organization,
  User,
  CurrentUser
) {
  $scope.user = new User();

  $scope.accept = function() {
    User.accept({
      password: $scope.user.password,
      name: $scope.user.name,
      invitation_token: $routeParams.token
    }, function(user) {
      if (user.invitation_accepted_at) {
        angular.copy(new User(user), CurrentUser);
        $location.search('token', undefined);
        $location.path('/clients');
      }
    }, function(response) {
      flash.error = response.data;
    })

  }
});
