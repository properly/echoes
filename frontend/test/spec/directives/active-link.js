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

describe('Directive: activeLink', function() {
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    scope,
    elmScope,
    lct;

  beforeEach(inject(function($rootScope, $compile, _$location_) {
    lct = _$location_;

    element = angular.element('<li active-link><a href="/abc">My link</a><li>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
  }));

  it('add active class', function() {
    lct.path = function() {
      return "/abc";
    }

    scope.$digest();
    expect(element.hasClass('active')).toBeTruthy();
  });

  it('has no active class', function() {
    lct.path = function() {
      return "/abcd";
    }

    scope.$digest();
    expect(element.hasClass('active')).toBeFalsy();
  });
});
