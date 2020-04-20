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

describe('Directive: datefieldDirective', function() {
  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  let element,
    isolateScope,
    scope;

  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    scope.date = moment('2014-02-03T03:00:00.000Z');

    element = angular.element('<input datefield="date" click-toggle="att" />');
    element = $compile(element)(scope);

    isolateScope = element.isolateScope();
    scope.$apply();
  }));

  it('sets value of input to formatted date string', function() {
    expect(element.val()).toBe('3 de fevereiro de 2014');
  });

  it('changing model value triggers change of value', function() {
    scope.date = moment('2014-02-02T03:00:00.000Z');
    scope.$apply();
    expect(element.val()).toBe('2 de fevereiro de 2014');
  });

  describe('clickToggle toggle attribute on click', function() {

    it('when false', inject(function($compile) {
      scope.att = false;

      let el = angular.element('<input datefield="date" click-toggle="att" />');
      el = $compile(el)(scope);

      el.triggerHandler('click');

      expect(el.isolateScope().clickToggle).toBe(true)
    }));

    it('when true', inject(function($compile) {
      scope.att = true;

      let el = angular.element('<input datefield="date" click-toggle="att" />');
      el = $compile(el)(scope);

      el.triggerHandler('click');

      expect(el.isolateScope().clickToggle).toBe(false)
    }));

  });

});
