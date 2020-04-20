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

describe('Controller: ReviewsPostsShowCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var ReviewsPostsShowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    spyOn(window, 'EventSource').and.returnValue({
      addEventListener: angular.noop,
      removeEventListener: angular.noop
    });

    $httpBackend.when('GET', '/api/sessions/current').respond();
    $httpBackend.when('GET', '/api/sessions/current?uuid=123').respond();
    $httpBackend.when('GET', '/api/posts/1?uuid=123').respond({
      name: 'name',
      revisions: [1, 2]
    });

    ReviewsPostsShowCtrl = $controller('ReviewsPostsShowCtrl', {
      $scope: scope,
      $routeParams: {
        id: 1,
        uuid: 123
      }
    });

    $httpBackend.flush();
  }));

  it('assigns scope post', function() {
    expect(scope.post.name).toBe('name');
  });

  it('assigns uuid', function() {
    expect(scope.uuid).toEqual(123);
  });

  it('assigns isClient', function() {
    expect(scope.isClient).toBeTruthy();
  });

  it('assigns noRevisionsFallback', function() {
    expect(scope.noRevisionsFallback).toBeFalsy();
  });

  describe('#getNavLink', function() {
    it('returns correct url', function() {
      expect(scope.getNavLink(100)).toEqual('/reviews/123/posts/100');
    });
  });
});
