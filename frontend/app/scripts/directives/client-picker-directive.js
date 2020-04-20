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

angular.module(
  'echoesApp'
).directive('clientPicker', function() {
  return {

    templateUrl: 'views/clients/picker.html',

    scope: {
      client: '=ngModel',
      onChange: '=',
      selected: '=selected'
    },

    restrict: 'E',

    controller: function(
      $scope,
      $filter,
      Client,
      Organization,
      flash
    ) {
      // findById
      //
      // @param [Array<Object>] an array of objects where each object responds to id
      // @param [Integer|String] identifier to match against
      // @return [Object] The object with an id matching the second param
      function findById(collection, id) {
        return _.find(collection, function(model) {
          return model.id === parseInt(id, 10);
        });
      }

      // Load all clients
      $scope.clients = Client.query({},
        function(clients) {
          $scope.client = findById(clients, $scope.selected) || new Client();
        }
      );

      $scope.organization = Organization.current();

      $scope.setClient = function(selected) {
        if (selected) {
          $scope.selected = selected.id;
          $scope.client = selected;

          if (typeof $scope.onChange === 'function')
            $scope.onChange(selected.id);

          return
        }

        $scope.selected = $scope.client = null;
      }

      // Create a new client
      $scope.newClientModal = function() {
        Client.newModal().then(function(client) {
          $scope.clients.push(client);
          $scope.setClient(client);
          flash.success = $filter('t')('client.created')
        });
      }

      // React to changed client id and load related packages
      $scope.$watch('clientId', function(clientId) {
        if (clientId && $scope.clients.length) {
          $scope.client = findById($scope.clients, clientId) || new Client();
        }
      });

    }
  };
});
