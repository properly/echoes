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

angular.module('echoesApp')

.controller('ClientsNewCtrl', function(
  $scope,
  $http,
  $modalInstance,
  flash,
  Client
) {
  $scope.client = new Client();

  $scope.create = function() {
    $scope.client.$save(function(client) {
      if (client.id) {
        $modalInstance.close(client);
      }
    }, function(response) {
      flash.error = response.data;
    });
  }

});
