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

describe('Service: Breakpoint', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var Breakpoint,
    $window,
    result;

  function setResult() {
    result = 2;
  }

  beforeEach(angular.mock.inject(function(_Breakpoint_, _$window_) {
    Breakpoint = _Breakpoint_;
    $window = _$window_;

    $window.innerWidth = 100;
    result = 0;
  }));

  describe('Breakpoint.add: in the interval', function() {
    beforeEach(angular.mock.inject(function($resource) {
      Breakpoint.add(0, setResult);
    }));

    it('sets result', function() {
      expect(result).toEqual(2);
    });
  });

  describe('Breakpoint.add: not in the interval', function() {
    beforeEach(angular.mock.inject(function($resource) {
      Breakpoint.add(0, 50, setResult);
    }));

    it('does not set result', function() {
      expect(result).not.toEqual(2);
    });
  });
});
