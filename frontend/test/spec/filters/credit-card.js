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

describe('Filter: creditCard', function () {

  // load the filter's module
  beforeEach(angular.mock.module('echoesApp'));

  // initialize a new instance of the filter before each test
  var creditCard;
  beforeEach(inject(function ($filter) {
    creditCard = $filter('creditCard');
  }));

  it('returns nothing for empty', function () {
    expect(creditCard('')).toBe('');
  });

  it('returns class name for amex', function () {
    expect(creditCard('344071987321771')).toBe('amex');
  });

  it('returns class name for diners', function () {
    expect(creditCard('30220088968340')).toBe('diners-club-carte-blanche');
  });

  it('returns class name for mastercard', function () {
    expect(creditCard('5382390269618304')).toBe('mastercard');
  });

  it('returns class name for visa', function () {
    expect(creditCard('4532 2551 5715 8261')).toBe('visa');
  });

  it('returns nothing for incomplete visa number', function () {
    expect(creditCard('4024 0071 2484 112')).toBe(undefined);
  });

});
