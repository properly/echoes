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

.controller('SharedCommentsCtrl', function(
  $scope,
  $routeParams,
  $location,
  Stream,
  Comment,
  Session,
  Reviewer,
  CurrentUser
) {

  $scope.currentUser = CurrentUser;

  var postScope = $scope.$parent.$parent;

  function createComment(revision, body) {

    var newComment = new Comment({
      body: body,
      uuid: $routeParams.uuid,
      revision_id: revision.id
    });

    newComment.$save(function(comment) {
      comment.$live();
      Stream.safeAdd(revision.comments, comment)
    });

    postScope.commentBody = '';
  }

  $scope.addComment = function(revision, body) {
    createComment(revision, body)
  }

  $scope.approve = function() {
    var post = angular.copy($scope.post);

    post.$update({
      status: 'approved',
      uuid: $routeParams.uuid
    }, function(data) {
      angular.extend($scope.post, data);
    });
  }

  $scope.reopen = function() {
    var post = angular.copy($scope.post);

    post.$update({
      status: '',
      uuid: $routeParams.uuid
    }, function(data) {
      angular.extend($scope.post, data);
    });
  }


  // Subscribe to new items
  Stream.subscribeToNewResources($scope.revision.comments, {
    resourceService: Comment,
    filterBy: 'revision_id',
    matchTo: $scope.revision.id
  });

});
