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

angular.module('echoesApp').directive(
  'uploader',
  function() {
    return {
      templateUrl: '/views/uploader/uploader.html',
      restrict: 'A',
      scope: {
        ngModel: '=',
        file: '@uploader',
        baseUrl: '@',
        size: '@',
        appendClass: '@',
        inlinePreview: '=?'
      },
      controller: 'uploaderDirectiveCtrl',
      link: function postLink(scope, element, attrs) {
        // Defaults
        scope.processingAttribute = scope.file + '_processing';
        scope.imageSize = scope.size || 'thumb';
      }
    };
  }
);
