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

angular.module('echoesApp').factory('Package',
  function(
    $resource,
    $modal
  ) {
    var Package = $resource('/api/packages/:id:action', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      },
      get_by_uuid: {
        method: 'GET',
        params: {
          action: 'uuid'
        }
      }
    }, 'package');

    Package.fromArray = function(array) {
      return _.map(array, function(pkg) {
        var p = new Package(pkg);
        return p;
      })
    }

    function openModal(attributes) {
      return $modal.open({
        templateUrl: 'views/packages/new.html',
        controller: 'PackagesNewCtrl',
        resolve: {
          attributes: function() {
            return attributes;
          }
        }
      });
    }

    Package.newModal = function(clientId) {
      return openModal(clientId).result;
    }

    // Public API here
    return Package;
  }
);
