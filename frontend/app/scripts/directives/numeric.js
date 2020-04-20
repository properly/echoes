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

.directive('numeric', function($filter) {
  return {
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      if (!ngModelCtrl) return;

      ngModelCtrl.$formatters.unshift(function(viewValue) {
        if(!viewValue) return;

        return viewValue.replace(/[^\d]/g, '');
      });


      ngModelCtrl.$parsers.unshift(function(viewValue) {
        if(!viewValue) return;
        // Return numbers only to model
        element.val(viewValue.replace(/[^\d]/g, ''));
        return viewValue.replace(/[^\d]/g, '');
      });

    }
  };
});
