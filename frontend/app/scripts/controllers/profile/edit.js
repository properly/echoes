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

.controller('ProfileCtrl', function(
  $scope,
  $modal,
  $log,
  $location,
  Upload,
  $rootScope,
  $filter,
  User,
  Organization,
  Session,
  CurrentUser,
  flash
) {

  Session.update().then(function(currentUser) {
    if (!currentUser.id) {
      return $location.path('/login');
    }

    $scope.user = new User(currentUser);
    $scope.user.$live();
  });

  $scope.$watch('user.avatar', function(userAvatar, old) {
    if (userAvatar == old) return;
  });

  $scope.updateProfile = function() {
    $scope.user.$update(function() {
      flash.success = $filter('t')('user.updated');
    });
  }

  $scope.onFileSelect = function(files) {
    var completed;

    $scope.progress = 0.1;
    $scope.files = files;

    $scope.upload = Upload.upload({
      url: '/api/users/' + $scope.user.id,
      file: $scope.files[0],
      fileFormDataName: 'avatar',
      data: $scope.user,
      method: "PUT"
    }).progress(function(progress) {
      if (!completed) // Firefox hits progress after success event
        $scope.progress = (progress.loaded / progress.total) * 100;
    }).success(function(response) {
      $scope.progress = undefined;
      completed = true;
      $scope.user = new User(response);
    });
  }

  $scope.confirmDelete = function(user) {
    var modalInstance = $modal.open({
      templateUrl: 'views/profile/modal/confirm.html',
    });

    modalInstance.result.then(function(result) {
      $log.debug('Modal closed', result)
      removeUserOrOrganization($scope.user).then(function() {
        $rootScope.$emit('sessionDestroyed');
        angular.copy({}, CurrentUser);
        $location.path('/'); // TODO: add "sad to see you go + ask feedback"
      });
    }, function(evt) {
      $log.debug('Modal dismissed', evt)
    });
  }

  function removeUserOrOrganization(user) {
    var recordToRemove = user.owner ? new Organization({
      id: user.organization_id
    }) : user;

    return recordToRemove.$remove();
  }

});
