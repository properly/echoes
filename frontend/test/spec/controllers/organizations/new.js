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

describe('Controller: OrganizationsNewCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var OrganizationsNewCtrl,
    scope,
    $httpBackend,
    user,
    CurrentUser;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _CurrentUser_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    CurrentUser = _CurrentUser_;

    CurrentUser.email = 'test@test.com';

    user = CurrentUser;

    $httpBackend.when('GET', '/api/sessions/current').respond({
      organization_id: null
    });

    $httpBackend.when('GET', '/api/organizations/1').respond({
      id: 1
    });

    $httpBackend.when('POST', '/api/organizations').respond({
      id: 1
    });

    $httpBackend.when('PUT', '/api/organizations/1').respond({
      id: 1
    });

    $httpBackend.when('PUT', '/api/organizations').respond({
      id: 2
    });

    OrganizationsNewCtrl = $controller('OrganizationsNewCtrl', {
      $scope: scope,
      Settings: {}
    });

  }));

  it('has no CurrentUser.organization_id', function() {
    expect(user.organization_id).toEqual(undefined);
  });

  it('inits scope.organization', function() {
    expect(scope.organization).toEqual(jasmine.any(Object));
  });

  it('does not init scope.organization.id', function() {
    expect(scope.organization.id).toEqual(undefined);
  });

  describe('#create', function() {
    var subSpy;

    beforeEach(function() {
      $httpBackend.flush();

      scope.create(scope.organization);
      $httpBackend.flush();
    });

    it('saves organization', function() {
      expect(scope.organization.id).toEqual(1);
    });

    it('sets user ownership', function() {
      expect(CurrentUser.owner).toBeTruthy();
    });
  });

  describe('#create:with organization', function() {
    var orgSpy;

    beforeEach(function() {
      $httpBackend.flush();
      orgSpy = spyOn(scope.organization, "$update").and.callThrough();

      scope.organization.id = 1;

      scope.create(scope.organization);
      $httpBackend.flush();
    });

    it('updates organization', function() {
      expect(orgSpy).toHaveBeenCalled();
    });
  });

  describe('#update', function() {
    beforeEach(function() {
      scope.update();
      $httpBackend.flush();
    });

    it('update organization', function() {
      expect(scope.organization.id).toEqual(2);
    });

  });


});
