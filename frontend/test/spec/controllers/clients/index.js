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

describe('Controller: ClientsIndexCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var ClientsIndexCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_) {
    scope = _$rootScope_.$new();
    $httpBackend = _$httpBackend_;
    spyOn(window, 'EventSource').and.returnValue({
      addEventListener: angular.noop,
      removeEventListener: angular.noop
    });

    $httpBackend.when('GET', '/api/clients').respond([
      {id: 1},
      {id: 2}
    ]);

    $httpBackend.when('GET', '/api/organizations/current').respond({
      id: 1
    });

    ClientsIndexCtrl= $controller('ClientsIndexCtrl', {
      $scope: scope,
      $routeParams: {
        id: 1
      }
    });
  }));
});
