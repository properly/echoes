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

describe('Filter: creditcardMask', function () {

  // load the filter's module
  beforeEach(angular.mock.module('echoesApp'));

  // initialize a new instance of the filter before each test
  var creditcardMask;
  beforeEach(inject(function ($filter) {
    creditcardMask = $filter('creditcardMask');
  }));

  it('formats numbers with spaces every 4th', function () {
    var text = '1234567890';
    expect(creditcardMask(text)).toBe('1234 5678 90');
  });

  it('returns nothing when not a valid number', function () {
    var text = 'angularjs';
    expect(creditcardMask(text)).toBe(undefined);
  });

});
