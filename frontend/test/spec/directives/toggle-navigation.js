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

describe('Directive: toggleNavigation', function() {
  beforeEach(angular.mock.module('echoesApp'));

  let element,
    scope;

  beforeEach(inject(function($rootScope, $compile) {
    document.documentElement.className = ''
    element = angular.element(`
      <div toggle-navigation>
        <a class="menu-toggle-link">first</a>
        <a>second</a>
      <div>
    `);
    scope = $rootScope.$new();
    element = $compile(element)(scope);
  }));

  it('add active class', function() {
    element.triggerHandler({ type: 'click', target: element.find('.menu-toggle-link')[0]});
    expect($('html').hasClass('navigation-open')).toBeTruthy();
  });

  it('remove active class', function() {
    document.documentElement.className = 'navigation-open'
    element.triggerHandler({ type: 'click', target: element.find('a:not(.menu-toggle-link)')[0]})
    expect($('html').hasClass('navigation-open')).toBeFalsy();
  });
});
