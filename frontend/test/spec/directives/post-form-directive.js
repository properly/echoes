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

describe('Directive: postForm', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var $httpBackend,
    element,
    post,
    scope;

  beforeEach(inject(function($rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    scope.post = {
      id: 1,
      name: 'Some name'
    }

    $httpBackend.when('GET', 'views/posts/_form.html').respond('');

  }));

  it('assigns post to isolateScope', inject(function($compile) {
    element = angular.element('<div post-form="post"></div>');
    element = $compile(element)(scope);
    $httpBackend.flush();

    expect(element.isolateScope().post).toBe(scope.post);
  }));
});
