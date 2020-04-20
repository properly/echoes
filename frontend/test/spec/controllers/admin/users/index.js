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

describe('Controller: AdminUsersIndexCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var AdminUsersIndexCtrl,
    $httpBackend,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', '/api/system_metas').respond({
      test: 1
    })
    $httpBackend.when('GET', '/api/users?page=1').respond([{
      id: 1
    }])
    AdminUsersIndexCtrl = $controller('AdminUsersIndexCtrl', {
      $scope: scope
    });
    scope.$apply();
    $httpBackend.flush();
  }));

  it('should attach meta to the scope', function() {
    expect(scope.meta.test).toEqual(1)
  });

  it('should attach a list of users to the scope', function() {
    expect(scope.users[0].id).toEqual(1)
  });
});
