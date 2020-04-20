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

describe('Directive: revision', function() {
  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    scope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.revision = {
      attr: 1,
      contents: [{}]
    };
    element = angular.element('<div revision="revision"></div>');
    element = $compile(element)(scope);
  }));

  it('adds a revision to scope', inject(function($compile) {
    expect(element.scope().revision.attr).toBe(1);
  }));

  it('reflects the revision on parent scope', inject(function($compile){
    element.scope().revision.attr = 'test';
    expect(scope.revision.attr).toBe('test');
  }));
});
