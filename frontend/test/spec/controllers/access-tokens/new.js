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

describe('Controller: AccessTokensNewCtrl', function() {

  beforeEach(angular.mock.module('echoesApp'));

  var AccessTokensNewCtrl,
    scope,
    $httpBackend;

  beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;

    $httpBackend.when('POST', '/api/access_tokens').respond({});
    $httpBackend.when('POST', '/api/reviewers').respond({});
    $httpBackend.when('GET', '/api/access_tokens?package_id=1').respond([{
      id: 1
    }]);

    AccessTokensNewCtrl = $controller('AccessTokensNewCtrl', {
      $scope: scope,
      $routeParams: {
        packageId: 1
      }
    });
  }));

  it('instanciates a token', function() {
    expect(scope.accessToken).toEqual(jasmine.any(Object));
  });

  it('instanciates a reviewer', function() {
    expect(scope.reviewer).toEqual(jasmine.any(Object));
  });

  it('instanciates accessTokens array', function() {
    $httpBackend.flush();
    expect(scope.accessTokens[0].id).toEqual(1);
  });

  describe('#sendPackage', function() {
    beforeEach(function() {
      scope.sendPackage();
      $httpBackend.flush();
    });

    it('pushes saved reviewer into accessTokens array', function() {
      expect(scope.accessTokens.length).toEqual(2);
    });

    it('re-instanciates accessToken after save', function() {
      expect(scope.accessToken.id).toEqual(undefined);
    });

    it('re-instanciates reviewer after save', function() {
      expect(scope.reviewer.id).toEqual(undefined);
    });
  });

});
