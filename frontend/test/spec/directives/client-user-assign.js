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

describe('Directive: clientUserAssign', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    $httpBackend,
    $event,
    scope;

  beforeEach(inject(function($rootScope, $compile, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', 'views/clients/_user-assign.html').respond(
      '<ul><li ng-repeat="user in users"></li></ul>'
    );
    $httpBackend.when('GET', '/api/clients/2/clients_users/available').respond([{
      id: 2,
      has_permission: false
    }, {
      id: 3,
      has_permission: true
    }]);

    scope.client = {
      id: 2
    }

    $event = {
      preventDefault: angular.noop,
      stopPropagation: angular.noop
    };

    element = angular.element('<div client-user-assign a="client"></div>');
    element = $compile(element)(scope);
    scope.editUsers = true;
    $httpBackend.flush();
  }));

  it('loads users', inject(function($compile) {
    expect(scope.users.length).toBe(2);
  }));

  it('togglePermission calls addToClient if user is not added', function() {
    var userSpy = spyOn(scope.users[0], '$addToClient');
    scope.togglePermission($event, scope.users[0], scope.client);
    expect(userSpy).toHaveBeenCalled();
  });

  it('togglePermission calls addToClient if user is not added', function() {
    var userSpy = spyOn(scope.users[1], '$removeFromClient');
    scope.togglePermission($event, scope.users[1], scope.client);
    expect(userSpy).toHaveBeenCalled();
  });
});
