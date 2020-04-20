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

.controller('AccessTokensNewCtrl', function(
  $scope,
  $routeParams,
  flash,
  Stream,
  Reviewer,
  AccessToken
) {

  $scope.clientId = $routeParams.clientId;
  $scope.packageId = $routeParams.packageId;
  $scope.accessToken = new AccessToken();
  $scope.reviewer = new Reviewer();
  $scope.accessTokens = AccessToken.query({
    package_id: $routeParams.packageId
  });

  var sendPackageError = function(response) {
    flash.error = response.data;
  }

  $scope.sendPackage = function() {
    $scope.reviewer.client_id = $routeParams.clientId;

    $scope.reviewer.$save(function(reviewer) {
      $scope.accessToken.reviewer_id = reviewer.id;
      $scope.accessToken.package_id = $routeParams.packageId;

      $scope.accessToken.$save(function(accessToken) {
        if (!_.find($scope.accessTokens, function(at) {
          return at.id == accessToken.id
        })) {
          Stream.safeAdd($scope.accessTokens, new AccessToken(accessToken))
        }

        // Don't re-use the token
        $scope.accessToken = new AccessToken();
        $scope.reviewer = new Reviewer();
      }, sendPackageError);
    }, sendPackageError);
  }

  // Subscribe to new items, only access tokens, reviewers are never updated
  Stream.subscribeToNewResources($scope.accessTokens, {
    resourceService: AccessToken,
    filterBy: 'package_id',
    matchTo: $routeParams.packageId
  });

});
