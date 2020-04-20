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

angular.module('echoesApp').controller(
  'RevisionsNewCtrl', function(
    $scope,
    $location,
    $routeParams,
    Content,
    Revision
  ) {

    $scope.revision = new Revision();
    $scope.revision.post_id = $routeParams.postId;
    $scope.revision.contents = [new Content({
      target: 'generic',
      revision: $scope.revision
    })];


    /* Submit the form, redirecting to calendar view
     * TODO: proper model validation
     */
    $scope.submit = function() {
      if ($scope.revision.contents.length < 1)
        return;

      $scope.revision.$saveWithHasMany().then(function() {
        $location.path("/clients/" + $routeParams.clientId + "/packages/" + $routeParams.packageId + "/posts/" + $routeParams.postId);
      });
    }

  }
);
