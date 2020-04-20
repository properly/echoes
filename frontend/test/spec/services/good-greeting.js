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

describe('Service: GoodGreeting', function () {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var GoodGreeting;
  beforeEach(inject(function (_GoodGreeting_) {
    GoodGreeting = _GoodGreeting_;
  }));

  it('return good-morning at 10:00', function () {
    expect(GoodGreeting.bodyClass(moment('10:00', 'HH:mm'))).toBe('good-morning');
  });

  it('return good-day at 12:00', function () {
    expect(GoodGreeting.bodyClass(moment('12:00', 'HH:mm'))).toBe('good-day');
  });

  it('return good-afternoon at 15:00', function () {
    expect(GoodGreeting.bodyClass(moment('15:00', 'HH:mm'))).toBe('good-afternoon');
  });

  it('return good-night at 20:00', function () {
    expect(GoodGreeting.bodyClass(moment('20:00', 'HH:mm'))).toBe('good-night');
  });

});
