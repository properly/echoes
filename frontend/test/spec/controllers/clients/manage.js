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

describe('Controller: ClientsManageCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp'));

  var ClientsManageCtrl,
    scope,
    $httpBackend,
    $modal;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_, _$modal_) {
    scope = _$rootScope_.$new();
    $httpBackend = _$httpBackend_;
    $modal = _$modal_;

    $httpBackend.when('GET', '/api/organizations/current').respond({id : 1});

    $httpBackend.when('GET', '/api/clients').respond([
      {
        id: 1,
        packagesCount: function() { return 2; },
        postsCount: function() { return 4; }
      },
      {
        id: 2,
        packagesCount: function() { return 1; },
        postsCount: function() { return 2; }
      },
    ]);

    ClientsManageCtrl= $controller('ClientsManageCtrl', {
      $scope: scope,
    });

    $httpBackend.flush();
  }));

  it('has 2 clients', function() {
    expect(scope.clients.length).toEqual(2);
  });

  it('has 3 packages', function() {
    expect(scope.totalPackages).toEqual(3);
  });

  it('has 6 posts', function() {
    expect(scope.totalPosts).toEqual(6);
  });

  describe('#update', function() {
    var client = {
      $update: function() {
        return;
      }
    }

    beforeEach(function() {
      spyOn(client, '$update');
    });

    it('updates instance', function() {
      scope.update(client);

      expect(client.$update).toHaveBeenCalled();
    });
  });

  describe('#confirmRemoval', function() {
    var result;

    beforeEach(function() {
      var modal = {
        result: {
          then: function() {
            result = "modalOpened";
            return "modalOpened";
          }
        }
      }

      spyOn($modal, 'open').and.returnValue(modal);

      scope.confirmRemoval();
    });

    it('opens modal', function() {
      expect(result).toEqual('modalOpened');
    });
  });
});
