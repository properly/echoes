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

describe('Directive: flashMessages', function() {
  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    elementSuccess,
    scope,
    elmScope,
    flash;

  beforeEach(inject(function($rootScope, $compile, _flash_, $timeout) {
    flash = _flash_;

    element = angular.element('<div flash-messages="error">{{flash.message}}<div>');
    elementSuccess = angular.element('<div flash-messages="success">{{flash.message}}<div>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
    elementSuccess = $compile(elementSuccess)(scope);

    flash.error = 'Error'

    scope.$digest();
  }));

  it('show error message', function() {
    expect(element.text()).toContain('Error');
  });

  it('show element', function() {
    expect(element[0].getAttribute('style')).toContain('block');
  });

  it('hide element', function() {
    element.scope().hide();
    expect(element[0].getAttribute('style')).toContain('none');
  });

  it('does not show error message in success div', function() {
    expect(elementSuccess.text()).not.toContain('Error');
  });

  it('hide element if message is empty', function() {
    flash.error = "";
    expect(element[0].getAttribute('style')).toContain('none');
  });
});
