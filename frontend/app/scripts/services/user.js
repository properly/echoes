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

.factory(
  'User',
  function($resource, Stream) {
    var User = $resource(
      '/api/users/:id:action', {
        id: '@id'
      }, {
        invite: {
          method: 'POST',
          params: {
            action: 'invite'
          }
        },
        accept: {
          method: 'POST',
          params: {
            action: 'accept_invitation'
          }
        },
        sendResetPasswordInstructions: {
          method: 'PUT',
          params: {
            action: 'send_reset_password_instructions'
          }
        },
        resetPassword: {
          method: 'PUT',
          params: {
            action: 'reset_password'
          }
        },
        update: {
          method: 'PUT'
        },
        create: {
          method: 'POST'
        },
        available: {
          url: '/api/clients/:client_id/clients_users/available',
          method: 'GET',
          isArray: true
        },
        addToClient: {
          url: '/api/clients/:client_id/clients_users',
          method: 'POST',
          params: {
            user_id: '@id'
          }
        },
        removeFromClient: {
          url: '/api/clients/:client_id/clients_users/remove',
          method: 'DELETE',
          params: {
            user_id: '@id',
            id: ''
          }
        }

      },
      'user'
    );

    User.prototype.live = function() {
      return Stream.subscribe('users/' + this.id, this);
    };

    User.from_array = function(array) {
      return _.map(array, function(user) {
        var u = new User(user);
        return u;
      })
    }

    // Public API here
    return User;
  }
);
