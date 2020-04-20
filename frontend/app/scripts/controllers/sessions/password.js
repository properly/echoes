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

.controller('SessionsPasswordCtrl', function(
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

  $scope.isResetPassword = $location.search()['resetPasswordToken'];
  $scope.submitLabel = ($scope.isResetPassword) ?
    'session.reset_password' :
    'session.send_email';

  var sendResetPasswordInstructions = function(user) {
    User.sendResetPasswordInstructions({
      email: user.email
    }, function() {
      flash.success = $filter('t')('user.password_sent')
    });
  }

  var resetPassword = function(user) {
    User.resetPassword({
      email: user.email,
      password: user.password,
      reset_password_token: $routeParams.resetPasswordToken
    }, function() {
      // Remove params so if user logs out, it will take them to login page
      $location.search('resetPasswordToken', null)

      Session.signIn({
        email: user.email,
        password: user.password
      }).then(function() {
        $location.path('/clients');
      });
    });
  }

  $scope.submit = function(user) {
    $scope.isResetPassword ? resetPassword(user) : sendResetPasswordInstructions(user);
  }
});
