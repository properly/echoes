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

.service('Stream', function(
  $q,
  $rootScope,
  Uuid,
  CurrentUser,
  ActionCable
) {

  function extendModel(deferred, model, data) {
    deferred.notify(
      angular.extend(model, data)
    );
  }

  function attrExists(collection, key, needle) {
    return !!_.find(collection, function(obj) {
      return obj[key] == needle;
    });
  }

  function filterAndAdd(collection, config, deferred, model, data) {
    var exists = attrExists(collection, 'id', data.id),
      belongs = (data[config['filterBy']] == config['matchTo']),
      Resource = config['resourceService'],
      newResource = new Resource(data);

    if (!exists && belongs) {
      if (angular.isFunction(newResource.$live))
        newResource.$live();

      deferred.notify(newResource);
      collection.push(newResource);
    }
  }

  var cable;

  var Stream = {
    safeAdd: function(collection, newResource) {
      if (!attrExists(collection, 'id', newResource.id)) {
        collection.push(newResource)
      }
    },
    subscribe: function(type, model, callback) {
      var organizationId;
      var deferred = $q.defer();

      if (!cable) {
        cable = ActionCable.createConsumer(
          '/api/cable' + (Uuid.token ? '?token=' + Uuid.token : '')
        );
      }

      // By listening to type (like 'posts/12'), we can assume
      // it's the right object and go ahead and update it
      $rootScope.$watch(function() {
        return CurrentUser.organization_id;
      }, function(orgId) {
        if (!orgId) return; // Wait for user to load

        var cb = angular.isFunction(callback) ? callback : extendModel;

        cable.subscriptions.create({
          channel: 'MessagesChannel'
        }, {
          received: function(event) {
            if (type === event.type) {
              cb(deferred, model, event.payload);
            }
          }
        });
      });

      // Return a promise with a triggered callback
      return deferred.promise.then();
    },

    /* subscribeToNewResources() example usage:
     *
     * Stream.subscribeToNewResources($scope.revision.comments, {
     *   resourceService: Comment,
     *   filterBy: 'revision_id',
     *   matchTo: $scope.revision.id
     * });
     *
     * @param[Array] Collection to push new resource into
     * @param[Object<resourceName:String, resourceService:Service, filterBy:String, matchTo:String>]
     */
    subscribeToNewResources: function(collection, config) {
      var resourceName = config['resourceName'] || (new config['resourceService']).$name,
        newEvent = 'new--' + resourceName;

      if (!resourceName)
        throw new Error('Missing resourceName or resourceService that responds do $name');

      // Using _.bind instead of native because phantomjs lacks a native bind
      return this.subscribe(newEvent, undefined, _.bind(filterAndAdd, this, collection, config));
    }

  }

  return Stream;
});
