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

describe('Controller: PostsEditCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var PostsEditCtrl,
    $httpBackend,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();

    $httpBackend.when('GET', '/api/posts/1').respond({
      id: 1
    });
    $httpBackend.when('GET', '/api/contents?revision_id=1').respond([{
      id: 2
    }]);

    PostsEditCtrl = $controller('PostsEditCtrl', {
      $scope: scope,
      $routeParams: {
        postId: 1
      }
    });

    $httpBackend.flush();
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.post.id).toBe(1);
  });

});
