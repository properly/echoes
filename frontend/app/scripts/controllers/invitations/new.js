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
).controller('InvitationsNewCtrl', function(
  $scope,
  $location,
  $routeParams,
  $filter,
  $modal,
  Stream,
  flash,
  User,
  Session,
  Organization
) {

  $scope.organization = Organization.current(function(org) {
    $scope.users = User.from_array(org.users); // TODO: remove from_array functionality

    Stream.subscribeToNewResources($scope.users, {
      resourceService: User,
      filterBy: 'organization_id',
      matchTo: org.id
    });
  });

  $scope.removeMember = function(member, users) {
    var modal = $modal.open({
      templateUrl: 'views/shared/removal-confirmation.html',
      controller: 'RemovalConfirmationCtrl',
      resolve: {
        removalTexts: function() {
          return {
            header: $filter('t')('organization.members.removal.header'),
            description: $filter('t')('organization.members.removal.description')
          }
        }
      }
    });

    modal.result.then(function() {
      member.$remove(function(member) {
        var i = users.indexOf(member);

        if (i == -1) return;

        users.splice(i, 1);
      });
    });
  }
});
