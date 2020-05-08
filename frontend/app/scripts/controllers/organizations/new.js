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

.controller('OrganizationsNewCtrl', function(
  $scope,
  $http,
  $location,
  $filter,
  $routeParams,
  Settings,
  flash,
  Session,
  CurrentUser,
  Organization) {

  var redirect = function() {
    // Redirect if organization already exists in new page
    if (CurrentUser.organization_id && $location.path() == '/organizations/new') {
      $location.path('/clients');
    }
  }

  var setOrganization = function() {
    $scope.organization = (CurrentUser.organization_id) ?
      Organization.get({
        id: CurrentUser.organization_id
      }) :
      new Organization();
  }

  redirect();
  setOrganization();

  // Redirect if current user has an organization already
  $scope.$watch(function() {
    return CurrentUser.id;
  }, function(userId, old) {
    if (userId == old) return;

    redirect();

    setOrganization();
  });

  var saveOrganization = function() {
    return $scope.organization.id ?
      $scope.organization.$update() :
      $scope.organization.$save();
  }

  $scope.create = function() {
    saveOrganization().then(function(organization) {
      CurrentUser.organization_id = organization.id;
      CurrentUser.owner = true;
      redirect();
    });
  }

  $scope.update = function() {
    $scope.organization.$update(function(organization) {
      flash.success = $filter('t')('organization.updated');
    })
  }

});
