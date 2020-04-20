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

describe('Filter: t', function () {
  var t;

  // load the filter's module
  beforeEach(angular.mock.module('echoesApp'));

  // initialize a new instance of the filter before each test
  beforeEach(inject(function ($filter) {
    t = $filter('t', function(string, args) {
      return "asdf"
    });
  }));

  it('returns the key suffixed with "other" when count=1', function () {
    var text = 'angularjs';
    expect(t(text, {count:1})).toBe('angularjs.one');
  });

  it('returns the key suffixed with "other" when count=2', function () {
    var text = 'angularjs';
    expect(t(text, {count:2})).toBe('angularjs.other');
  });

  it('should return the key when no count is present', function () {
    var text = 'angularjs';
    expect(t(text, {key:2})).toBe('angularjs');
  });

});
