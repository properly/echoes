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

.controller('PostsShowController', function(
  $scope,
  $routeParams,
  $location,
  $filter,
  $modal,
  flash,
  Session,
  Post,
  Comment,
  Content,
  Revision
) {
  var forEach = angular.forEach;

  $scope.post = Post.get({
    id: $routeParams.postId
  });

  $scope.post.$promise.then(function(post) {
    $scope.scheduledAt = moment(post.scheduled_at).format('ddd, D [de] MMM');
    post.revisions = Revision.query({
      post_id: post.id
    });

    return post.revisions.$promise;
  }).then(function(revisions) {

    forEach(revisions, function(revision) {
      Content.query({
        revision_id: revision.id
      }, function(contents) {
        revision.contents = contents;
      })
    });

  });

  // NOTE: duplicated in reviews/show controller
  $scope.getStatus = function() {
    return $scope.post.status ?
           $filter('t')('post.status.' + $scope.post.status)
         : '';
  }

  $scope.uuid = $routeParams.uuid;
  $scope.clientId = $routeParams.clientId;

  $scope.newRevisionUrl = '/clients/' + $routeParams.clientId +
    '/packages/' + $routeParams.packageId +
    '/posts/' + $routeParams.postId + '/revisions/new';

  $scope.destroy = function() {
    $scope.post.$remove(function() {
      $location.path('/clients/' + $scope.clientId + '/packages/' + $routeParams.packageId);
    });
  }

  $scope.confirmRevisionRemoval = function(revision, revisions) {
    var modal = openModal();

    modal.result.then(function() {
      revision.$remove(function(revision) {
        var i = revisions.indexOf(revision);

        if (i == -1) return;

        revisions.splice(i, 1);
      });
    });
  }

  $scope.getNavLink = function(id) {
    return '/clients/' + $scope.clientId + '/packages/' + $routeParams.packageId + '/posts/' + id;
  }

  function openModal() {
    return $modal.open({
      templateUrl: 'views/shared/removal-confirmation.html',
      controller: 'RemovalConfirmationCtrl',
      resolve: {
        removalTexts: function() {
          return {
            header: $filter('t')('revision.removal.header'),
            description: $filter('t')('revision.removal.description')
          }
        }
      }
    });
  }

  $scope.urlProcessed = function(url, processing) {
    if (!processing)
      return url;
  }

  $scope.editPostLink = function() {
    return '/clients/' + $scope.clientId + '/packages/' + $routeParams.packageId + '/posts/' + $routeParams.postId + '/edit';
  }

  $scope.editRevisionLink = function(revisionId) {
    return '/clients/' + $scope.clientId + '/packages/' + $routeParams.packageId + '/posts/' + $routeParams.postId + '/revisions/' + revisionId + '/edit';
  }
});
