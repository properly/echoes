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
).directive('packagePicker', function() {
  return {
    templateUrl: 'views/packages/picker.html',
    scope: {
      package: '=ngModel',
      clientId: '=',
      onChange: '=',
      selected: '='
    },
    restrict: 'E',
    controller: function(
      $scope,
      $filter,
      flash,
      Package
    ) {
      function findById(collection, id) {
        return _.find(collection, function(model) {
          return model.id === parseInt(id, 10);
        });
      }

      // Set ng-model to to package or null, set selected to id or null
      // the null is needed to trigger a server side validation
      function setSelectedPackage(pkg) {
        $scope.selected = pkg ? pkg.id : null;
        $scope.package = pkg || null;
      }

      // Fetches all packages from selected client
      $scope.loadPackages = function(clientId) {
        $scope.packages = Package.query({
          client_id: clientId
        }, function(packages) {
          var pkg = findById(packages, parseInt($scope.selected, 10));
          setSelectedPackage(pkg);
        });
      };

      $scope.newPackageModal = function(clientId) {
        Package.newModal({
          client_id: clientId
        }).then(function(pkg) {
          $scope.packages.push(pkg);
          $scope.setPackage(pkg);
          flash.success = $filter('t')('package.created');
        });
      }

      $scope.setPackage = function(pkg) {
        if (pkg) {
          $scope.selected = pkg.id;
          $scope.package = pkg;

          if (typeof $scope.onChange == 'function')
            $scope.onChange(pkg.id);
        } else {
          $scope.selected = null;
        }
      };

      // React to changed client id and load related packages
      $scope.$watch('clientId', function(clientId, oldClientId) {
        if ((clientId !== oldClientId) && !clientId) {
          $scope.packages = [];
          setSelectedPackage(null);
          return;
        }

        $scope.loadPackages(clientId);
      });
    }
  };
});
