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
).controller(
  'ClientsShowCtrl',
  function(
    $scope,
    $routeParams,
    $location,
    Stream,
    Client,
    Package,
    Post
  ) {
    $scope.clientId = $routeParams.clientId;

    $scope.view = $location.search()['view'];

    $scope.$watch(function() {
      return $location.search()['view'];
    }, function(newView) {
      if (newView !== $scope.view) {
        $scope.view = newView;
      }
    });

    $scope.$watch('week', function(week) {
      if (!week)
        return;

      $scope.posts = Post.query({
        client_id: $routeParams.clientId,
        start_date: week.isoWeekday(1).hour(0).minute(0).second(0).unix(),
        end_date: week.isoWeekday(7).hour(23).minute(59).second(59).unix()
      }, function() {
        Stream.subscribeToNewResources($scope.posts, {
          resourceService: Post,
          filterBy: 'client_id',
          matchTo: $scope.clientId
        });
      });
    });
  }
);
