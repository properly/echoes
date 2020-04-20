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

describe('Controller: ReviewsPackageShowCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var ReviewsPackageShowCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    ReviewsPackageShowCtrl = $controller('ReviewsPackageShowCtrl', {
      $scope: scope
    });

    $httpBackend.when('GET', '/api/sessions/current').respond({});

    $httpBackend.when('GET', '/api/packages/uuid').respond({});

    $httpBackend.when('GET', '/api/posts').respond([{ scheduled_at: '2014-04-13T03:00:00.000Z' }]);

    $httpBackend.flush();
  }));

  it('assigns isClient', function() {
    expect(scope.isClient).toBeTruthy();
  });

  it('assigns week', function() {
    expect(scope.week.format()).toBe(moment('2014-04-13T03:00:00.000Z').format());
  });
});
