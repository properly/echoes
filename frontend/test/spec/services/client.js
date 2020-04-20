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

describe('Service: Client', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var Client, client;

  beforeEach(inject(function(_Client_) {
    Client = _Client_;

    client = new Client({
      id: 1,
      name: "My Client",
      packages: [
        {
          id: 1,
          posts_count: 2
        },
        {
          id: 1,
          posts_count: 3
        }
      ]
    });
  }));

  describe('#packagesCount', function() {
    it('has 2 packages', function() {
      expect(client.packagesCount()).toEqual(2);
    });
  });

  describe('#postsCount', function() {
    it('has 5 posts', function() {
      expect(client.postsCount()).toEqual(5);
    });
  });
});

