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

describe('Directive: inviteUserForm', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    $httpBackend,
  $rootScope,
    scope;

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, $compile) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', 'views/invitations/_invitation-form.html').respond('');

    $httpBackend.when('POST', '/api/users/invite').respond({
      id: 1,
      organization_id: 1
    });

    scope.client = {
      id: 2
    };

    scope.organization = {
      id: 4
    };

    scope.users = [];

    element = angular.element('<div invite-user-form client="client" organization="organization" users="users"></div>');
    element = $compile(element)(scope);

    $httpBackend.flush();
  }));

  it('inits user', function() {
    expect(element.isolateScope().user).toEqual(jasmine.any(Object));
  });

  describe('#hasReachedLimit', function() {
    beforeEach(function() {
      element.isolateScope().users = [{}, {}]
      element.isolateScope().user.email = 'som@email.com';
      element.isolateScope().invite();
    });

    // http backend is not collaborating
    xit('set user to a new object', function() {
      expect(flash.error).toEqual(null);
    });
  });

});
