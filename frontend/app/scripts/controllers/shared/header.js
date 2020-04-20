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

.controller('HeaderCtrl', function(
  $scope,
  $route,
  $routeParams,
  $location,
  $modal,
  Session,
  Organization,
  CurrentUser
) {
  var modalInstance;

  function calendarPath(params) {
    var path = '/clients/';

    if (params.uuid) {
      // TODO Adjust
      return '/reviews/' + params.uuid + '/posts';
    }

    if (params.clientId)
      path += params.clientId;

    if (params.packageId)
      path += '/packages/' + params.packageId;

    return path;
  }

  function listPath(params) {
    return '/clients/manage';
  }

  function logoPath(params) {
    if (params.uuid) {
      return '/';
    }

    return '/clients';
  }

  $scope.showCalendar = function() {
    $location.path($scope.calendarPath).search('scheduledAt', null);
  }

  $scope.$on('$routeChangeSuccess', function() {
    $scope.calendarPath = calendarPath($routeParams);
    $scope.listPath = listPath($routeParams);
    $scope.logoPath = logoPath($routeParams);

    $scope.uuid = $routeParams.uuid;
  });

  $scope.user = CurrentUser;

  $scope.current = function(path) {
    return path == $location.path().replace(/\/posts\/\d.*/g, '');
  }

  $scope.signOut = function() {
    Session.signOut().then(function() {
      $location.path('login');
    });
  }

  $scope.isLogin = function() {
    return $location.path() == '/login' || $location.path() == '/password';
  }

  $scope.isHome = function() {
    return $location.path() == '/';
  }

  $scope.isPublic = function() {
    return $location.path() == '/use_terms' ||
      $location.path() == '/organizations/invitations/accept';
  }

  $scope.isGuest = function() {
    return CurrentUser.role === 'guest';
  }

  $scope.$watch('user.id && isHome()', function() {
    if (!CurrentUser.id || $scope.isHome() || $scope.isPublic() || $scope.isLogin()) return;

    if (!CurrentUser.name) {
      $modal.open({
        templateUrl: 'views/profile/modal/name.html',
        controller: 'ModalNameCtrl'
      });
    }

    if (CurrentUser.organization_id) {
      $scope.organization = getCurrentOrganization();
    }
  });

  function getCurrentOrganization() {
    return Organization.current({
      uuid: $routeParams.uuid
    })
  }

});

