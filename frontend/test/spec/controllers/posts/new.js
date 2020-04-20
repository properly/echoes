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

describe('Controller: PostsNewCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var PostsNewCtrl,
    scope,
    evt,
    $httpBackend,
    $rootScope,
    currentUser;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_, Client) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    currentUser = {
      id: 1,
      email: 'em@ail.com'
    };

    evt = {
      preventDefault: function() {
        return;
      }
    }

    $httpBackend.when('GET', '/api/users/current').respond(currentUser);

    $httpBackend.when('GET', '/api/organizations/current').respond({
      id: 1,
    });

    $httpBackend.when('GET', '/api/posts').respond([{}]);

    $httpBackend.when('PUT', '/api/posts/1').respond({
      id: 1
    });
    $httpBackend.when('POST', '/api/posts').respond({
      id: 1
    });
    $httpBackend.when('POST', '/api/revisions').respond({
      id: 2
    });
    $httpBackend.when('POST', '/api/contents').respond({
      id: 3
    });
    $httpBackend.when('POST', '/api/attachments').respond({
      id: 4
    });

    PostsNewCtrl = $controller('PostsNewCtrl', {
      $scope: scope,
      $routeParams: {
        packageId: 1
      }
    });
  }));

  it('inits scope.post', function() {
    expect(scope.post).toEqual(jasmine.any(Object));
  });

  it('inits scope.post.revisions', function() {
    expect(scope.post.revisions.length).toEqual(1);
  });

  describe('submit', function() {
    beforeEach(function() {
      scope.submit();
      $httpBackend.flush();
    });

    it('saves revision', function() {
      expect(scope.post.revisions[0].id).toEqual(2);
    });

    it('does not add a content', function() {
      expect(scope.post.revisions[0].contents[0].id).toEqual(3);
    })
  });

});
