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

describe('Directive: uploaderDirective', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    $httpBackend,
    scope;

  beforeEach(inject(function($rootScope, $compile, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.when(
      'GET', '/views/uploader/uploader.html'
    ).respond('');

    scope.model = {
      id: 1
    };

    element = angular.element('<div uploader="image" ng-model="model" inline-preview="false"></div>');
    element = $compile(element)(scope);
    $httpBackend.flush();
  }));

  it('assigns image_processing to scope', function() {
    expect(element.isolateScope().processingAttribute).toBe('image_processing');
  });

  it('assigns ngModel to scope', function() {
    expect(element.isolateScope().ngModel.id).toBe(1);
  });
});
