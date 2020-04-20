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

describe('Directive: focusOn', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    scope,
    $timeout;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  // focus test doesn't work
  xit('should make hidden element visible', inject(function($compile, $timeout) {
    element = angular.element('<div> <input type="text" focus-on="foxus" /> </div>');
    element = $compile(element)(scope);
    scope.foxus = true;
    scope.$apply();
    $timeout.flush()
    expect(element.find('input')[0]).toBe(document.activeElement);
  }));
});
