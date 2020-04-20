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

describe('Controller: PostsShowController', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var PostsShowController,
    scope,
    $httpBackend,
    revision,
    $modal,
    $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_, _$modal_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    $modal = _$modal_;

    spyOn(window, 'EventSource').and.returnValue({
      addEventListener: angular.noop,
      removeEventListener: angular.noop
    });

    revision = {
      id: 1,
      comments: []
    }

    var comment = {
        body: 'body',
        revision_id: 1
      },
      post = {
        id: 1
      };

    $httpBackend.when('GET', '/api/sessions/current').respond();
    $httpBackend.when('GET', '/api/posts/1').respond(post);
    $httpBackend.when('DELETE', '/api/posts').respond(post);
    $httpBackend.when('POST', '/api/comments').respond(comment);
    $httpBackend.when('GET', '/api/clients/1').respond({
      id: 1
    });

    PostsShowController = $controller('PostsShowController', {
      $scope: scope,
      $routeParams: {
        uuid: 'uuid',
        packageId: 1,
        clientId: 1,
        postId: 1
      }
    });

  }));

  it('assigns a post to scope', function() {
    $httpBackend.flush();
    expect(scope.post.id).toEqual(1);
  });

  it('assigns uuid', function() {
    expect(scope.uuid).toEqual('uuid');
  });

  it('assigns newRevisionUrl', function() {
    expect(scope.newRevisionUrl).toEqual('/clients/1/packages/1/posts/1/revisions/new');
  });

  describe('#destroy', function() {
    beforeEach(function() {
      scope.clientId = 1;

      scope.destroy();
      $httpBackend.flush();
    });

    it('redirects to calendar', function() {
      expect($location.path()).toEqual('/clients/1/packages/1');
    });
  });

  describe('#getNavLink', function() {
    beforeEach(function() {
      scope.clientId = 1;
    });

    it('returns correct url', function() {
      expect(scope.getNavLink(100)).toEqual('/clients/1/packages/1/posts/100');
    });
  });

  describe('#confirmRevisionRemoval', function() {
    var result;

    beforeEach(function() {
      var modal = {
        result: {
          then: function() {
            result = "modalOpened";
            return "modalOpened";
          }
        }
      }

      spyOn($modal, 'open').and.returnValue(modal);

      scope.confirmRevisionRemoval();
    });

    it('opens modal', function() {
      expect(result).toEqual('modalOpened');
    });
  });
});
