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

.controller('SessionsNewCtrl', function(
  $scope,
  $location,
  $filter,
  $routeParams,
  Session,
  User,
  flash,
  CurrentUser
) {
  $scope.user = CurrentUser;
  // redirect if logged in user tries to access /login
  $scope.$watch(function() {
    return CurrentUser.id;
  }, function(userId, old) {
    if (userId && userId == old) return;

    redirectLoggedInUser($scope.user);
  });

  function signUp(credentials) {
    // Force a value on terms of use
    credentials.terms_of_use = !!credentials.terms_of_use;
    Session.signUp(credentials).then(redirectLoggedInUser);
  }

  function signIn(user) {
    Session.signIn({
      email: user.email,
      password: user.password
    }).then(redirectLoggedInUser);
  }

  function redirectLoggedInUser(user) {
    if (!user.id) return;

    (user.organization_id) ?
      $location.path('/clients') :
      $location.path('/organizations/new');
  }

  redirectLoggedInUser($scope.user);

  $scope.submit = function(user) {
    $scope.isNewUser ? signUp(user) : signIn(user);
  }

  $scope.setNewUser = function(val) {
    $scope.isNewUser = val;
    var urlParam = val ? val.toString() : null;
    $location.search("isNewUser", urlParam);
    $scope.submitLabel = $scope.isNewUser ? 'sign_up' : 'sign_in';
    $scope.switchButtonLabel = $scope.isNewUser ? 'session.already_registered' : 'session.create_new_account';
  }

  $scope.setNewUser($location.search()["isNewUser"]);
});
