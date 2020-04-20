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

describe('Service: Post', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var Post, $httpBackend;
  beforeEach(inject(function(_Post_, _$httpBackend_) {
    Post = _Post_;
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', '/api/posts/1').respond({
      id: 1,
      name: 'asdf'
    })
    $httpBackend.when('GET', '/api/posts').respond([{
      id: 1,
      name: 'asdf'
    }])

  }));

  describe('query', function() {

    it('Gets an array', function() {
      var posts = Post.query();
      $httpBackend.flush();
      expect(posts.length).toBe(1);
      expect(posts[0].name).toEqual('asdf');
    });

  });

  describe('Get', function() {
    it('gets a single object', function() {
      var post = Post.get({id: 1});
      $httpBackend.flush();
      expect(post.id).toEqual(1);
    });
  });

});

