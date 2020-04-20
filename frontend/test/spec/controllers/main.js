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

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var MainCtrl,
    $httpBackend,
    $location,
    $controller,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_, _$location_) {
    scope = $rootScope.$new();
    $location = _$location_;
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
  }));

  describe('user logged in', function() {

    it('adds currentUser to scope', function() {
      $httpBackend.when('GET', '/api/sessions/current').respond({
        id: 1
      });
      MainCtrl = $controller('MainCtrl', {
        $scope: scope
      });
      $httpBackend.flush();

      expect(scope.currentUser.id).toEqual(1);
    });

  });

  describe('user not logged in', function() {

    it('doesnt redirect', function() {
      $httpBackend.when('GET', '/api/sessions/current').respond(null);
      MainCtrl = $controller('MainCtrl', {
        $scope: scope
      });
      $httpBackend.flush();

      expect(scope.currentUser.id).toEqual(undefined);
    });

  });
});
