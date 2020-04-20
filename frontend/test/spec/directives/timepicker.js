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

describe('Directive: timepicker', function() {
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    scope,
    elmScope;

  beforeEach(inject(function($rootScope, $compile, $httpBackend) {

    $httpBackend.when('GET', 'views/posts/_timepicker.html').respond('<input type="text" /><ul class="time-options"><li ng-repeat="option in options"><a>{{option}}</a></li></ul>');
    element = angular.element('<div timepicker></div>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
    $httpBackend.flush();
  }));

  it('has a input', function() {
    expect(element.find('input').length).toBe(1);
  });

  it('has a options div', function() {
    expect(element.find('.time-options').length).toBe(1);
  });

  describe('keyup event with 0', function() {
    beforeEach(function() {
      element.find('input').val('0');
      element.find('input').trigger('keyup');
    });

    it('shows options div', function() {
      expect(element.find('.time-options').attr('style')).toMatch('display: block;');
    })

    it('has 10 time options', function() {
      expect(element.find('.time-options').find('a').length).toBe(10);
    })

    it('first option is 00:00', function() {
      expect(element.find('.time-options').find('a:first').html()).toBe('00:00');
    })

    it('last option is 00:45', function() {
      expect(element.find('.time-options').find('a:last').html()).toBe('00:45');
    })
  });

  describe('keyup event 9', function() {
    beforeEach(function() {
      element.find('input').val('9');
      element.find('input').trigger('keyup');
    });

    it('first option is 09:00', function() {
      expect(element.find('.time-options').find('a:first').html()).toBe('09:00');
    })

    it('last option is 09:45', function() {
      expect(element.find('.time-options').find('a:last').html()).toBe('09:45');
    })
  });

  describe('keyup event 9:2', function() {
    beforeEach(function() {
      element.find('input').val('9:2');
      element.find('input').trigger('keyup');
    });

    it('first option is 09:20', function() {
      expect(element.find('.time-options').find('a:first').html()).toBe('09:20');
    })

    it('last option is 10:05', function() {
      expect(element.find('.time-options').find('a:last').html()).toBe('10:05');
    })
  });
});
