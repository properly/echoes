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

describe('Controller: CalendarFiltersCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var CalendarFiltersCtrl,
    scope,
    $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$location_) {
    scope = $rootScope.$new();
    $location = _$location_;

    CalendarFiltersCtrl = $controller('CalendarFiltersCtrl', {
      $scope: scope,
      $routeParams: {
        clientId: 1
      }
    });
  }));

  it('#selectPackage builds package url', function() {
    scope.selectPackage(2);
    expect($location.path()).toEqual('/clients/1/packages/2');
  });

  it('#newAccessTokenPath builds access token url', function() {
    scope.newAccessTokenPath(1, 2);
    expect($location.path()).toEqual('/clients/1/packages/2/access-tokens/new');
  });

  it('#selectClient builds access token url', function() {
    scope.selectClient(1, 2);
    expect($location.path()).toEqual('/clients/1');
  });
});
