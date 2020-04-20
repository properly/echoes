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

describe('Service: User', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var User, $httpBackend, users, result;

  beforeEach(inject(function(_User_, _$httpBackend_) {
    User = _User_;
    $httpBackend = _$httpBackend_;
  }));

  describe('when querying for user', function() {

    it('has no attributes', function() {
      $httpBackend.when('GET', '/api/users/1').respond({
        id: 1,
        email: 'email'
      });
      var user = User.get({id: 1});
      $httpBackend.flush();
      expect(user.id).toBe(1);
    });
  });

  describe('#from_array', function() {
    beforeEach(function() {
      users = [
        {
          id: 1,
          email: 'one@echoes.com'
        },
        {
          id: 2,
          email: 'two@echoes.com'
        }
      ]

      result = User.from_array(users);
    });

    it('set User with first data', function() {
      expect(result[0].email).toEqual('one@echoes.com');
    })

    it('set User with second data', function() {
      expect(result[1].email).toEqual('two@echoes.com');
    })


  })

});
