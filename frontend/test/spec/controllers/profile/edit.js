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

describe('Controller: ProfileCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var ProfileCtrl,
    scope,
    $httpBackend,
    $modal,
    $location,
    $rootScope,
    CurrentUser,
    User,
    Organization,
    removeOrganizationSpy,
    uploadSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(
    $controller,
    _$rootScope_,
    Upload,
    _$location_,
    _$httpBackend_,
    _$modal_,
    _User_,
    _CurrentUser_,
    _Organization_
  ) {
    $rootScope = _$rootScope_;
    User = _User_;
    Organization = _Organization_;
    scope = $rootScope.$new();
    $modal = _$modal_;
    $location = _$location_;
    CurrentUser = _CurrentUser_;
    $httpBackend = _$httpBackend_;
    spyOn(window, 'EventSource').and.returnValue({
      addEventListener: angular.noop,
      removeEventListener: angular.noop
    });
    uploadSpy = spyOn(Upload, 'upload').and.returnValue({
      progress: function() {
        return {
          success: function() {
            return {
              error: jasmine.createSpy()
            };
          }
        }
      }
    });
    spyOn($rootScope, '$emit');

    var user = {
      id: 1,
      organization_id: 1,
      email: "old@email.com"
    }
    $httpBackend.when("GET", "/api/sessions/current").respond(user)
    $httpBackend.when("GET", "/api/users/1").respond(user);
    $httpBackend.when("PUT", "/api/users/1").respond(angular.extend(user, {
      email: '_new@email.com_'
    }));
    $httpBackend.when("DELETE", "/api/users/1").respond('');
    $httpBackend.when("DELETE", "/api/organizations/1").respond('');
    angular.extend(CurrentUser, new User({
      id: 1,
      avatar: {
        url: "url"
      },
      email: "asdf@asdf.test"
    }));

    spyOn(Organization.prototype, '$remove').and.callThrough();

    ProfileCtrl = $controller('ProfileCtrl', {
      $rootScope: $rootScope,
      $scope: scope,
      Upload: Upload,
      CurrentUser: CurrentUser,
      Organization: Organization
    });

    $httpBackend.flush();
  }));

  it('adds current user to scope', function() {
    expect(scope.user.id).toBe(1);
  });

  it('updateProfile calls update with user model', function() {
    scope.user.email = "new@email.com";
    scope.updateProfile();
    $httpBackend.flush();
    expect(scope.user.email).toEqual("_new@email.com_");
  });

  it('onFileSelect uploads files', function() {
    scope.onFileSelect([{}]);
    expect(uploadSpy).toHaveBeenCalled();
  });

  describe('#destroy', function() {
    beforeEach(function() {});

    describe('user is owner', function() {
      beforeEach(function() {
        scope.user.owner = true;
        scope.user.organization_id = 1;
        var modal = {
          result: {
            then: function(success, error) {
              success(scope.user);
              error(scope.user);
            }
          }
        }
        spyOn($modal, 'open').and.returnValue(modal);
        scope.confirmDelete(scope.user);
        $httpBackend.flush();
      });

      it('calls destroy on organization', function() {
        expect(Organization.prototype.$remove).toHaveBeenCalled();
      });

      it('redirects to /', function() {
        expect($location.path()).toEqual('/');
      });

      it('emits sessionDestroyed on root scope', function() {
        expect($rootScope.$emit).toHaveBeenCalledWith('sessionDestroyed');
      })
    })

    describe('user is owner', function() {
      beforeEach(function() {
        scope.user.owner = false;
        var modal = {
          result: {
            then: function(success, error) {
              success(scope.user);
              error(scope.user);
            }
          }
        }
        spyOn($modal, 'open').and.returnValue(modal);
        scope.confirmDelete(scope.user);
        $httpBackend.flush();
      });

      it('calls destroy on user', function() {
        expect(CurrentUser).toEqual({});
      });

      it('redirects to /', function() {
        expect($location.path()).toEqual('/');
      });

    });
  });
});
