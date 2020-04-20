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

describe('Service: Package', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var Package, $httpBackend;
  beforeEach(inject(function(_Package_, _$httpBackend_) {
    Package = _Package_;
    $httpBackend = _$httpBackend_;

    $httpBackend.when('GET', '/api/packages/1').respond({
      id: 1,
      name: 'asdf'
    })
    $httpBackend.when('GET', '/api/packages').respond([{
      id: 1,
      name: 'asdf'
    }])

  }));

  describe('query', function() {

    it('Gets an array', function() {
      var packages = Package.query();
      $httpBackend.flush();
      expect(packages.length).toBe(1);
      expect(packages[0].name).toEqual('asdf');
    });

  });

  describe('Get', function() {
    it('gets a single object', function() {
      var pkg = Package.get({id: 1});
      $httpBackend.flush();
      expect(pkg.id).toEqual(1);
    });
  });

  describe('#fromArray', function() {
    it('transform an array in Packages', function() {
      var pkgs = [{name: 'Package 1'}, {name: 'Package 2'}];
      var newPkgs = Package.fromArray(pkgs);
      expect(newPkgs[0].name).toEqual(pkgs[0].name);
    });
  });
});
