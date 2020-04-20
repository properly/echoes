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

.directive('manageable', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      var actionsWrapper = element.children('.item-manage'),
        originalValue;

      scope.editing = false;

      function toggleEditing() {
        element.toggleClass('editing');

        scope.$apply(function() {
          scope.editing = !scope.editing;
        });
      }

      function stopEditing() {
        element.removeClass('editing');

        scope.$apply(function() {
          scope.editing = false;
        });
      }

      actionsWrapper.on('mouseenter', function() {
        element.addClass('active');
      });

      actionsWrapper.on('mouseleave', function() {
        element.removeClass('active');
      });

      actionsWrapper.find('.icons-edit').on('click', function() {
        toggleEditing();

        originalValue = actionsWrapper.find('input[type=text]').val();
      });

      element.find('form').on('submit', function(e) {
        stopEditing();
      });

      element.find('input[type="button"]').on('click', function(e) {
        actionsWrapper.find('input[type=text]').val(originalValue);
        stopEditing();
      });

    },

    controller: function($scope) {
      $scope.toggleUserAssign = function() {
        $scope.editUsers = !$scope.editUsers;
      }

    }
  }
});
