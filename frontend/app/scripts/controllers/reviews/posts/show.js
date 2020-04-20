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

.controller('ReviewsPostsShowCtrl', function(
  $scope,
  $routeParams,
  $filter,
  Stream,
  Post,
  Revision,
  Content,
  Comment,
  Package,
  Client,
  Uuid,
  Session
) {
  var forEach = angular.forEach;
  $scope.isClient = true
  $scope.uuid = Uuid.token = $routeParams.uuid;

  Session.update();

  $scope.post = Post.get({
    uuid: $routeParams.uuid,
    id: $routeParams.id
  });

  // NOTE: duplicated in post/show controller
  $scope.getStatus = function() {
    return $scope.post.status ?
           $filter('t')('post.status.' + $scope.post.status)
         : '';
  }

  $scope.post.$promise.then(function(post) {
    $scope.scheduledAt = moment(post.scheduled_at).format('D [de] MMM')
    post.revisions = Revision.query({
      uuid: $routeParams.uuid,
      post_id: post.id
    });

    return post.revisions.$promise;
  }).then(function(revisions) {

    forEach(revisions, function(revision) {
      Content.query({
        uuid: $routeParams.uuid,
        revision_id: revision.id
      }, function(contents) {
        uuid: $routeParams.uuid,
        revision.contents = contents;
      })
    });

  });

  $scope.getNavLink = function(id) {
    return '/reviews/' + $scope.uuid + '/posts/' + id;
  }

  $scope.urlProcessed = function(url, processing) {
    if (!processing)
      return url;
  }
});
