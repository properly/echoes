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
  .directive('postsCalendar', function(
    $http,
    $templateCache,
    $compile,
    $location,
    Breakpoint
  ) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        ngModel: '=',
        filterBy: '=filter',
        currentWeek: '=week',
        admin: '@',
        clientId: '@',
        packageId: '@',
        uuid: '@',
        view: '@'
      },
      controller: function($scope, $location) {

        $scope.currentWeek = momentFromTimestamp($location.search()['currentWeek']);

        $scope.showPostPath = function(uuid, postId, clientId, packageId) {
          var path = (uuid) ?
            'reviews/' + uuid + '/posts/' + postId :
            'clients/' + clientId + '/packages/' + packageId + '/posts/' + postId;

          $location.path(path).search(
            'currentWeek', $scope.currentWeek.unix()
          );
        }

        $scope.newPostPath = function(index, clientId, packageId) {
          var path = '/clients/' + clientId + (packageId ? '/packages/' + packageId : '') + '/posts/new'

          $location.path(path).search({
            scheduledAt: $scope.getTimestamp(index),
            currentWeek: $scope.currentWeek.unix()
          });

        }

        $scope.today = function() {
          $location.search('currentWeek', moment().unix());
        }

        $scope.prevWeek = function() {
          $location.search('currentWeek', $scope.currentWeek.day(-7).unix()).replace();
        }

        $scope.nextWeek = function() {
          $location.search('currentWeek', $scope.currentWeek.day(+7).unix()).replace();
        }

        $scope.$watch(function() {
          return $location.search()['currentWeek'];
        }, setCurrentWeek);



        $scope.$watch('ngModel', function(posts) {
          if (!posts ||  !posts.$resolved) return; // return if promise hasn't returned yet

          if (!$location.search()['currentWeek']) { // jump to first post if no timestamp present
            $scope.currentWeek = moment(posts[0].scheduled_at);
            $location.search('currentWeek', moment(posts[0].scheduled_at).unix()); // set current week in url
          }

          $scope.postsForWeek = splitPerDay($scope.ngModel);
        }, true);

        function momentFromTimestamp(timestamp) {
          return (typeof timestamp == 'number') ?
            moment.unix(timestamp) :
            moment();
        }

        function setCurrentWeek(timestamp) {
          $scope.currentWeek = momentFromTimestamp(timestamp);
          $scope.postsForWeek = splitPerDay($scope.ngModel);
        }

        function splitPerDay(posts) {
          var week = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
          ];
          angular.forEach(posts, function(post) {
            if ($scope.currentWeek.isoWeek() !== moment(post.scheduled_at).isoWeek())
              return;

            var day = moment(post.scheduled_at).isoWeekday();
            week[day - 1].push(post);
          });
          return week;
        }
      },
      link: function postLink(scope, element, attrs) {

        scope.$watch('view', function(newView) {
          changeTemplate(newView)
        });

        // Calendar as grid is available only after medium breakpoint
        Breakpoint.add(0, Breakpoint.medium, changeTemplateToList);

        scope.getDate = function(index) {
          return scope.currentWeek.isoWeekday(index + 1).format('D');
        }

        scope.getWeekday = function(index) {
          return scope.currentWeek.isoWeekday(index + 1).format('ddd');
        }

        scope.getWeek = function(index) {
          return scope.currentWeek.isoWeek();
        }

        scope.getMonth = function(index) {
          return scope.currentWeek.format('MMMM')
        }

        scope.getYear = function(index) {
          return scope.currentWeek.format('YYYY')
        }

        scope.getTimestamp = function(index) {
          return scope.currentWeek.isoWeekday(index + 1).format('X');
        }

        /* Return true if the index of the day this week
         * is today.
         *
         * @param[Integer] index of day
         * @return[Boolean]
         */
        scope.currentDay = function(i) {
          var date = scope.currentWeek.isoWeekday(i + 1);
          // diff 'days' returns true for previous day as well
          return date.diff(moment(), 'hours') == 0;
        }

        /* Show calendar as a list
         *
         */
        function changeTemplateToList() {
          changeTemplate('list');
        }

        /* Change template according to view: calendar or list
         *
         * @param [String] view
         */
        function changeTemplate(view) {
          var view = view || 'calendar',
              templateUrl = 'views/calendar/_' + view + '.html';

          $location.search('view', view);

          $http.get(templateUrl, {cache: $templateCache}).success(function(tplContent) {
            element.html($compile(tplContent)(scope));
          });
        }


      }
    };
  });
