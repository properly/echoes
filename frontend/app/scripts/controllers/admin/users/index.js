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

.controller('AdminUsersIndexCtrl', function($scope, $location, User, SystemMeta) {
  $scope.queryParams = {};
  $scope.userMeta = {};

  $scope.meta = SystemMeta.query();

  $scope.$watch(function() {
    return $location.search();
  }, function(params) {
    $scope.queryParams.page = params['page'] || 1;
    $scope.queryParams.per_page = params['perPage'];
  }, true);

  $scope.$watch('queryParams', function(queryParams) {
    User.query(queryParams, function(users, getResponseHeader) {
      $scope.users = users;
      $scope.userMeta.currentPage = getResponseHeader('x-pagination-current-page')
      $scope.userMeta.totalPages = getResponseHeader('x-pagination-total-pages')
    });
  }, true);

  $scope.previousPagePath = function() {
    $location.search('page', Math.max(1, $scope.queryParams.page - 1));
  }

  $scope.nextPagePath = function() {
    $location.search('page', Math.min($scope.userMeta.totalPages, $scope.queryParams.page + 1));
  }

  $scope.destroy = function(user) {
    if(confirm('Sure you want to delete: ' + user.email + '?')) {
      user.$remove(function(){
        $scope.users.splice($scope.users.indexOf(user), 1);
      });
    }
  }

});
