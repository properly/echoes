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

describe('Directive: clientPickerDirective', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    $httpBackend,
    isolateScope,
    evt,
    Client,
    scope;

  beforeEach(inject(function($rootScope, $compile, _$httpBackend_, _Client_) {
    $httpBackend = _$httpBackend_;
    Client = _Client_;
    scope = $rootScope.$new();

    evt = {
      preventDefault: angular.noop
    };

    scope.client = {};
    scope.clientId = 1;

    $httpBackend.when('GET', 'views/clients/picker.html').respond('')

    $httpBackend.when('GET', '/api/clients').respond([{
      id: 1
    }]);

    $httpBackend.when('GET', '/api/organizations/current').respond({
      id: 1,
    });

    $httpBackend.when('POST', '/api/clients').respond({
      id: 3
    });

    element = angular.element('<client-picker ng-model="client" selected="clientId"></client-picker>');
    element = $compile(element)(scope);

    $httpBackend.flush();
    isolateScope = element.isolateScope();

  }));

  it('assigns clients', function() {
    expect(isolateScope.clients.length).toEqual(1);
  });

  describe('newClientModal', function() {
    var clientSpy;

    beforeEach(function() {
      var modal = {
        then: function(cb) {
          return cb({
            id: 3
          });
        }
      }
      isolateScope.client = {
        id: 2
      }
      clientSpy = spyOn(Client, 'newModal').and.returnValue(modal);
      isolateScope.newClientModal();
    });

    it('saves client', function() {
      expect(clientSpy).toHaveBeenCalled();
    });

    it('adds client to clients', function() {
      expect(isolateScope.clients.length).toBe(2);
    });

    it('hides new client fields', function() {
      expect(isolateScope.showNewClient).toBeFalsy();
    });

    it('selects new value', function() {
      expect(isolateScope.client.id).toBe(3);
    });

  });

});
