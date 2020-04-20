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

describe('Controller: RevisionsNewCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var RevisionsNewCtrl,
    $httpBackend,
    scope,
    routeParamsStub;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    routeParamsStub = jasmine.createSpy('routeParamsStub');
    routeParamsStub.postId = 1;

    $httpBackend.when('POST', '/api/revisions').respond({
      id: 1
    });

    $httpBackend.when('POST', '/api/contents').respond({
      id: 2
    });

    $httpBackend.when('DELETE', '/api/contents/1').respond({});

    RevisionsNewCtrl = $controller('RevisionsNewCtrl', {
      $scope: scope,
      $routeParams: routeParamsStub
    });
  }));

  it('inits scope.revision', function() {
    expect(scope.revision).toEqual(jasmine.any(Object));
  });

  it('sets post_id to revision', function() {
    expect(scope.revision.post_id).toEqual(1);
  });

  it('inits scope.revison.contents as an array', function() {
    expect(scope.revision.contents).toEqual(jasmine.any(Array));
  });

  it('inits scope.revison.contents[0]', function() {
    expect(scope.revision.contents[0]).toEqual(jasmine.any(Object));
  });

  describe('submit: without content', function() {
    beforeEach(function() {
      scope.revision.contents = [];
      scope.submit();
    });

    it('does not save revision', function() {
      expect(scope.revision.id).toEqual(undefined);
    });

  });

  describe('submit with content', function() {
    beforeEach(function() {
      scope.contents = [{
        $saveWithHasMany: jasmine.createSpy('update')
      }]

      scope.submit();
      $httpBackend.flush();
    });

    it('saves revision', function() {
      expect(scope.revision.id).toEqual(1);
    });

    it('saves a content', function() {
      expect(scope.revision.contents[0].id).toEqual(2);
    })
  });

});
