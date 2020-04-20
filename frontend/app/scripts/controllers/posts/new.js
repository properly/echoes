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
).controller('PostsNewCtrl', function(
  $scope,
  $http,
  $q,
  $location,
  $routeParams,
  $filter,
  flash,
  Post,
  Client,
  Content,
  Revision
) {
  function postUrl() {
    return '/clients/' +
      $scope.post.client_id +
      '/packages/' +
      $scope.post.package_id +
      '/posts/' +
      $scope.post.id;
  }

  // Init the post
  $scope.post = new Post({
    package_id: $routeParams.packageId,
    client_id: $routeParams.clientId,
    revisions: []
  });

  // Get scheduleDate from url
  $scope.post.scheduled_at = ($routeParams.scheduledAt) ?
    moment($routeParams.scheduledAt, 'X') : moment().startOf('hour').add(1, 'hour');

  // When a post is updated after a save, the post.scheduled_time is cleared.
  // the watcher makes sure scheduled_at is moment object when it gets updated
  $scope.$watch('post.scheduled_at', function(time) {
    if (typeof time === 'string') {
      $scope.post.scheduled_at = moment(time);
    }
  });

  // Init a default revision
  var newContent = new Content({
    target: 'generic'
  });

  var newRevision = new Revision({
    post: $scope.post,
    contents: [newContent]
  });

  newContent.revision = newRevision;

  $scope.post.revisions.push(newRevision);

  // Submit the form, redirecting to calendar view
  $scope.submit = function() {
    $scope.post.$saveWithHasMany().then(function() {
      $location.path(postUrl());
    }, function(response){
      flash.error = response.data;
    });
  };
});
