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

describe('Controller: ClientsNewCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var ClientsNewCtrl,
    modalInstance,
    closeSpy,
    scope,
    flash,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _flash_) {
    scope = $rootScope.$new();
    flash = _flash_;
    $httpBackend = _$httpBackend_;
    modalInstance = {
      close: function(argument) {
        return;
      },
      dismiss: function(argument) {
        return;
      }
    }

    closeSpy = spyOn(modalInstance, 'close');

    ClientsNewCtrl = $controller('ClientsNewCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      flash: flash
    });
  }));

  it('inits scope.client', function() {
    expect(scope.client).toEqual(jasmine.any(Object));
  });

  describe('#create', function() {
    beforeEach(function() {
      $httpBackend.when('POST', '/api/clients').respond({
        id: 1
      });

      scope.create();
      $httpBackend.flush();
    });

    it('saves client', function() {
      expect(scope.client.id).toEqual(1);
    });

    it('calls close on success', function() {
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('#create on error', function() {
    it('calls close on success', function() {
      $httpBackend.when('POST', '/api/clients').respond(403, 'error');
      scope.create();
      $httpBackend.flush();

      expect(flash.error).toEqual([ 'error' ]);
    });

  });

});
