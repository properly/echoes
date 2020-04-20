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

describe('Directive: packagePickerDirective', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    $httpBackend,
    $modal,
    isolateScope,
    evt,
    Package,
    scope;


  beforeEach(inject(function($rootScope, $compile, _$httpBackend_, _$modal_, _Package_) {
    $modal = _$modal_;
    $httpBackend = _$httpBackend_;
    evt = {
      preventDefault: angular.noop
    };
    Package = _Package_;
    scope = $rootScope.$new();
    scope.package = {};
    scope.post = {
      package_id: undefined
    };
    scope.clientId = 1;

    $httpBackend.when('GET', 'views/packages/picker.html').respond('');

    $httpBackend.when('GET', '/api/packages?client_id=3').respond([{
      id: 4
    }]);

    $httpBackend.when('GET', '/api/packages').respond([{
      id: 1
    }]);

    $httpBackend.when('POST', '/api/packages').respond({
      id: 5
    });

    element = angular.element('<package-picker ng-model="package" selected="post.package_id" client-id="clientId"></package-picker>');
    element = $compile(element)(scope);
    $httpBackend.flush();
    isolateScope = element.isolateScope();
  }));

  describe('newPackageModal', function() {
    var packageSpy;

    beforeEach(function() {
      var modal = {
        then: function(cb) {
          return cb({
            id: 5
          });
        }
      }

      isolateScope.packages = [];
      scope.clientId = 1;
      scope.$apply();

      packageSpy = spyOn(Package, 'newModal').and.returnValue(modal);
      isolateScope.newPackageModal(1);
      scope.$apply();
    });

    it('saves package', function() {
      expect(packageSpy).toHaveBeenCalled();
    });

    it('adds package to packages', function() {
      expect(isolateScope.packages.length).toBe(1);
    });

    it('set post.package_id', function() {
      expect(scope.post.package_id).toBe(5);
    });

  });

  describe('loadPackages', function() {
    beforeEach(function() {
      isolateScope.packages = [];
      scope.client = {
        id: 2
      };
      isolateScope.loadPackages();
      $httpBackend.flush();
    });

    it('assigns packages', function() {
      expect(isolateScope.packages.length).toEqual(1);
    });

    it('loads packages if clientId changes', function() {
      scope.clientId = 3;
      $httpBackend.flush();
      expect(isolateScope.packages[0].id).toEqual(4);
    });
  });


});
