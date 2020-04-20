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

describe('Directive: scheduledAtDirective', function() {
  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    isolateScope,
    scope;

  beforeEach(inject(function($rootScope, $compile, $httpBackend) {
    scope = $rootScope.$new();

    scope.post = {
      scheduled_at: '2014-02-03T03:00:00.000Z'
    };

    $httpBackend.when('GET', 'views/posts/_datepicker.html').respond('<p>Datepicker</p>');
    element = angular.element('<div scheduled-at="post"></div>');
    element = $compile(element)(scope);

    scope.post.scheduled_at = moment().endOf('year');

    $httpBackend.flush();
    isolateScope = element.isolateScope();
    scope.$apply();
  }));

  it('sets scheduled_time', function() {
    expect(isolateScope.post.scheduled_time).toBe('23:59');
  });

  it('sets scheduled_date date', function() {
    expect(isolateScope.post.scheduled_date.date()).toBe(31);
  });

  describe('update time', function() {
    it('sets time to 14:00', function() {
      scope.post.scheduled_time = '14:00';
      scope.$apply();

      expect(isolateScope.post.scheduled_at.hour()).toBe(14);
    });
  });

  describe('update date', function() {
    it('sets date to today', function() {
      scope.post.scheduled_date = new Date();
      scope.$apply();

      expect(isolateScope.post.scheduled_at.date()).toBe(moment().date());
    });
  });
});
