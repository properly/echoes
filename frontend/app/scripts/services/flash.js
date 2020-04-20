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

.provider('flash', function() {
  var Flash =  function() {
    var success, error, type,
        id = null,
        subscribersTotal = 0,
        subscribers = {};

    /* Notify subscribers that a new message was added
     *
     * @param [String] type of the message - error, success
     * @param [String] Message to broadcast
     */
    var notify = function(type, message) {
      angular.forEach(subscribers, function (subscriber) {

        // If type is not defined, broadcast for all
        var matchesType = !subscriber.type || subscriber.type === type;
        var matchesId = (!id && !subscriber.id) || subscriber.id === id;

        if (matchesType && matchesId) {
          subscriber.cb(message, type);
        }
      });
    }

    /* If message is a string, transform it in an array so there is no
     * problem with ngRepeat
     *
     * @param [String | Array] Message
     * @return [Array] Original array or string wrapped as array
     */
    var messageToArray = function(message) {
        return (_.isString(message)) ? [message] : message;
    }

    /* Subscribe to messages
     *
     * @param [Function] Function that will be called when notified
     * @param [String] Type of the message - error, success
     * @param [Integer] id of the element to be notified
     */
    this.subscribe = function(subscriber, type, id) {
      subscribersTotal += 1;

      subscribers[subscribersTotal] = {
        cb: subscriber,
        type: type,
        id: id
      };

      return subscribersTotal;
    };

    /* Unsubscribe to messages
     *
     * @param [Integer] Index of message
     */
    this.unsubscribe = function(i) {
      delete subscribers[i];
    };

    /* Reset all messages
     *
     */
    this.clean = function() {
      success = error = type = null;
    };

    /* Define attributes for flash types: error and success
     *
     */
    Object.defineProperty(this, 'success', {
      get: function () {
        return success;
      },
      set: function (message) {
        message = messageToArray(message);

        success = message;
        type = 'success';
        notify(type, message);
      }
    });

    Object.defineProperty(this, 'error', {
      get: function () {
        return error;
      },
      set: function (message) {
        message = messageToArray(message);

        error = message;
        type = 'error';
        notify(type, message);
      }
    });
  };


  /* Required in provider
   *
   */
  this.$get = function() {
    return new Flash();
  }
});
