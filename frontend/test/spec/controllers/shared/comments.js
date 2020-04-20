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

describe('Controller: SharedCommentsCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp', function($provide) {
    $provide.value('Uuid', {});
  }));

  var SharedCommentsCtrl,
    scope,
    $httpBackend,
    comment = {
      body: 'body',
      revision_id: 1
    },
    revision = {
      id: 1,
      comments: [comment]
    },
    post = {
      id: 1
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, Post, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new().$new();
    $httpBackend = _$httpBackend_;
    scope.post = new Post(post);
    scope.post.revisions = [revision];
    scope.revision = revision;
    scope.comments = [];

    $httpBackend.when('POST', '/api/comments').respond(comment);
    $httpBackend.when('GET', '/api/sessions/current').respond({
      id: 1
    });
    $httpBackend.when('PUT', '/api/posts/1').respond({
      id: 1,
      status: "approved",
    });
    $httpBackend.when('PUT', '/api/posts/1?status=').respond({
      id: 1,
      status: "",
    });
    $httpBackend.when('PUT', '/api/posts/1?status=approved').respond({
      id: 1,
      status: "approved",
    });

    SharedCommentsCtrl = $controller('SharedCommentsCtrl', {
      $scope: scope
    });
  }));

  it('reopen reopens post', function() {
    expect(scope.post.status).toBe(undefined);
    scope.reopen();
    $httpBackend.flush();
    expect(scope.post.status).toEqual('');
  });

  it('reopen saves a comment', function() {
    scope.reopen(revision, '');
    expect(scope.post.revisions[0].comments[0].body).toEqual('body');
  });

  it('approve approves post', function() {
    expect(scope.post.status).toBe(undefined);
    scope.approve();
    $httpBackend.flush();
    expect(scope.post.status).toEqual('approved');
  });

  it('approve saves a comment', function() {
    scope.approve(revision, '');
    expect(scope.post.revisions[0].comments[0].body).toEqual('body');
  });

  it('addComment saves a comment', function() {
    scope.addComment(revision, '');
    expect(revision.comments[0].body).toEqual('body');
  });

  it('addComment saves a comment', function() {
    scope.addComment(revision, '');
    $httpBackend.flush();
    expect(revision.comments[0].body).toEqual('body');
  });

});
