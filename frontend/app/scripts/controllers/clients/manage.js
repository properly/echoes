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

.controller('ClientsManageCtrl', function(
  $scope,
  $modal,
  $filter,
  flash,
  Stream,
  Package,
  CurrentUser,
  Organization,
  Client
) {

  $scope.user = CurrentUser;
  $scope.organization = Organization.current();


  $scope.clients = Client.query(function() {
    countPackagesAndPosts();

    // TODO: Separate this query, when doing a loop to instanciate packages,
    //    the delete event won't get attached by the decorator
    _.each($scope.clients, function(client, i) {
      client.packages = Package.fromArray(client.packages);

      // Subscribe to new items
      Stream.subscribeToNewResources(client.packages, {
        resourceService: Package,
        filterBy: 'client_id',
        matchTo: client.id
      });

    })
  });

  function countPackagesAndPosts() {
    $scope.totalPackages = $scope.totalPosts = 0;

    _.each($scope.clients, function(client, i) {
      $scope.totalPackages += client.packagesCount();
      $scope.totalPosts += client.postsCount();
    })
  }

  $scope.update = function(resource) {
    resource.$update(function(resource) {}, function(response) {
      flash.error = response.data;
    });
  }

  $scope.confirmRemoval = function(resource, collection) {
    var modal = openModal(resource);

    modal.result.then(function() {
      resource.$remove(function(resource) {
        var i = collection.indexOf(resource);

        if (i == -1) return;

        collection.splice(i, 1);
      });
    });
  }

  function openModal(resource) {
    return $modal.open({
      templateUrl: 'views/shared/removal-confirmation.html',
      controller: 'RemovalConfirmationCtrl',
      resolve: {
        removalTexts: function() {
          return {
            header: $filter('t')('client.removal.header'),
            description: $filter('t')('client.removal.description', {
              name: resource.name
            })
          }
        }
      }
    });
  }

  // Subscribe to new items
  Stream.subscribeToNewResources($scope.clients, {
    resourceService: Client
  });

});
