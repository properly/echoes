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

describe('Controller: RevisionsIndexCtrl', function () {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var RevisionsIndexCtrl,
    subscribeToNewResourcesSpy,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    subscribeToNewResourcesSpy = jasmine.createSpy();

    var Stream = {
      subscribeToNewResources: subscribeToNewResourcesSpy
    }
    scope.post = {
      revisions: []
    }

    RevisionsIndexCtrl = $controller('RevisionsIndexCtrl', {
      $scope: scope,
      Stream: Stream
    });
  }));

  it('calls subscribeToNewResources', function() {
    scope.$apply();
    expect(subscribeToNewResourcesSpy).toHaveBeenCalled();
  });
});
