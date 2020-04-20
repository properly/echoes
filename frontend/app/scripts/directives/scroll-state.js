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

/**
 * @ngdoc directive
 * @name echoesApp.directive:scrollState
 * @description adds has-scroll if the element has an overflow
 * scroll-top, scroll-bottom are added at the top and bottom respectively.
 * allows removing styling that indicates there's more content
 * # scrollState
 */
angular.module(
  'echoesApp'
).directive('scrollState', function($window) {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      function toggleClasses() {
        if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
          element.addClass('scroll-bottom');
        } else {
          element.removeClass('scroll-bottom');
        }

        if (element.scrollTop() === 0) {
          element.addClass('scroll-top');
        } else {
          element.removeClass('scroll-top');
        }
      }

      scope.$watch(function() {
        return element[0].clientHeight
      }, function(val) {
        if (element.innerHeight() < element[0].scrollHeight) {
          element.addClass('has-scroll');
          toggleClasses();
        }
      });


      angular.element(element).bind("scroll", _.debounce(toggleClasses, 10));
    }
  }
});
