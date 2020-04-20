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

angular.module(
  'echoesApp'
).controller('PostsEditCtrl', function(
  $scope,
  $location,
  $routeParams,
  $modal,
  $filter,
  Post
) {
  function postUrl() {
    return "/clients/" +
      $scope.post.client_id +
      "/packages/" +
      $scope.post.package_id +
      "/posts/" +
      $scope.post.id;
  }

  $scope.post = Post.get({
    id: $routeParams.postId
  }, function() {
    $scope.post.scheduled_at = moment($scope.post.scheduled_at);
  })

  $scope.destroy = function() {
    var modal = openModal();

    modal.result.then(function() {
      $scope.post.$remove(function() {
        $location.path('/clients/' + $routeParams.clientId + '/packages/' + $routeParams.packageId);
      });
    });
  }

  function openModal() {
    return $modal.open({
      templateUrl: 'views/shared/removal-confirmation.html',
      controller: 'RemovalConfirmationCtrl',
      resolve: {
        removalTexts: function() {
          return {
            header: $filter('t')('post.removal.header'),
            description: $filter('t')('post.removal.description', {
              name: $scope.post.name
            })
          }
        }
      }
    });
  }

  // Save and navigate to post view
  $scope.submit = function() {
    $scope.post.$update().then(function() {
      $location.path(postUrl());
    });
  }

  // Go back to post view
  $scope.back = function() {
    $location.path(postUrl());
  }
});
