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

describe('Directive: manageable', function() {
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    scope,
    wrapper,
    button;

  beforeEach(inject(function($rootScope, $compile) {

    element = angular.element('<li manageable><div class="item-manage">My item<a class="icons-edit">edit</a></div><li>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
    wrapper = element[0].getElementsByTagName('div')[0];
    button = wrapper.getElementsByTagName('a')[0];
  }));

  it('add active class', function() {
    angular.element(wrapper).triggerHandler('mouseenter');
    expect(element.hasClass('active')).toBeTruthy();
  });

  it('add active class', function() {
    angular.element(wrapper).triggerHandler('mouseenter');
    angular.element(wrapper).triggerHandler('mouseleave');
    expect(element.hasClass('active')).toBeFalsy();
  });

  xit('add editing class', function() {
    angular.element(button).triggerHandler('click');
    expect(element.hasClass('editing')).toBeTruthy();
  });

});
