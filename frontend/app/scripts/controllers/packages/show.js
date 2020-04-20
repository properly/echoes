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

.controller(
  'PackagesShowCtrl',
  function(
    $scope,
    $routeParams,
    $location,
    $filter,
    Stream,
    Client,
    Package,
    Post
  ) {
    function setSendLabel(sentForReview) {
      var key = $scope.$eval(sentForReview) ? 'package.send_for_review.resend' : 'package.send_for_review.send';

      $scope.sendLabel = $filter('t')(key);
    }

    function setActiveClient(clients) {
      $scope.client = _.find(clients, function(client) {
        return client.id == $routeParams.clientId;
      });

      Stream.subscribeToNewResources($scope.clients, {
        resourceService: Client
      });
    }

    function setActivePackage(packages) {
      $scope.package = _.find(packages, function(pkg) {
        return pkg.id == $routeParams.packageId;
      });
      setSendLabel('package.sent_for_review');

      Stream.subscribeToNewResources($scope.packages, {
        resourceService: Package,
        filterBy: 'client_id',
        matchTo: $routeParams.clientId
      });
    }

    $scope.packageId = $routeParams.packageId;
    $scope.clientId = $routeParams.clientId;

    $scope.clients = Client.query(setActiveClient);

    $scope.packages = Package.query({
      client_id: $routeParams.clientId
    }, setActivePackage);

    $scope.view = $location.search()['view'];

    $scope.$watch(function() {
      return $location.search()['view'];
    }, function(newView) {
      if (newView !== $scope.view) {
        $scope.view = newView;
      }
    });

    $scope.$watch("package", function(pkg, oldPkg) {
      if (pkg == oldPkg) return; // don't query the same posts twice

      $scope.posts = Post.query({
        client_id: $routeParams.clientId,
        package_id: pkg.id
      }, function() {
        Stream.subscribeToNewResources($scope.posts, {
          resourceService: Post,
          filterBy: 'package_id',
          matchTo: pkg.id
        });
      });
    }, true);

  }
);
