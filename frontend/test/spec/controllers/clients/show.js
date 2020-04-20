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

describe('Controller: ClientsShowCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  let ClientsShowCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', '/api/packages?client_id=1').respond([{
      id: 1
    }]);
    $httpBackend.when('GET', '/api/clients/1').respond({
      id: 3
    });
    $httpBackend.when('GET', '/api/clients').respond([{}]);

    ClientsShowCtrl = $controller('ClientsShowCtrl', {
      $scope: scope,
      $routeParams: {
        id: 1,
        clientId: 1
      }
    });
  }));

  it('updates packages if week changes', function() {
    $httpBackend.when('GET', /\/api\/posts\?client_id=1&end_date=\d+&start_date=\d+/).respond([{
      id: 2
    }]);

    scope.week = moment('2014-02-03T03:00:00.000Z').day(-7);
    scope.$apply();
    $httpBackend.flush();
    expect(scope.posts[0].id).toEqual(2);
  });

});
