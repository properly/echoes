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

angular.module('echoesApp').factory(
  'Session',
  function($rootScope, $resource, User, CurrentUser, Uuid) {
    var SessionResource = $resource(
      '/api/sessions/:action', {}, {
        current_user: {
          method: 'GET',
          params: {
            action: 'current'
          }
        },
        destroy: {
          method: 'DELETE'
        }
      });

    var Session = {

      update: function() {
        var params = Uuid.token ? {
          uuid: Uuid.token
        } : null;

        return SessionResource.current_user(params, function(data) {
            angular.copy(new User(data), CurrentUser);
          },
          function() {
            angular.copy({}, CurrentUser); // reset CurrentUser if request fails
          }).$promise;
      },

      currentUser: CurrentUser,

      signUp: function(user) {
        return (new User(user)).$save(function(user) {
          angular.copy(user, CurrentUser);
        });
      },

      signIn: function(user) {
        return (new SessionResource(user)).$save(function(user) {
          angular.copy(new User(user), CurrentUser);
        });
      },

      signOut: function(cb) {
        $rootScope.$emit('sessionDestroyed');

        return (new SessionResource).$destroy(function() {
          angular.copy({}, CurrentUser);
        });
      }
    }

    Session.update();

    // Public API here
    return Session;
  }
);
