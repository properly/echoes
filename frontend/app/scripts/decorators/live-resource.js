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

// TODO: break into a separate module and open source it!

angular.module('echoesApp')

.config(function($provide) {
  $provide.decorator('$resource', ['$delegate', 'Stream',
    function($delegate, Stream) {

      var forEach = angular.forEach,
        extend = angular.extend,
        isFunction = angular.isFunction;

      // Seems hard to grab these from the factory
      var DEFAULT_ACTIONS = {
        'get': {
          method: 'GET'
        },
        'save': {
          method: 'POST'
        },
        'query': {
          method: 'GET',
          isArray: true
        },
        'remove': {
          method: 'DELETE'
        },
        'delete': {
          method: 'DELETE'
        }
      };

      function removeMember(collection, member) {
        // we can't use delete instead of splice, because we can't leave the object as undefined
        // in the array. splice with "-1" will delete the last object, so check before
        var index = collection.indexOf(member);
        if (index == -1) return;

        collection.splice(index, 1);
      }

      // Subscribe to updates using Stream
      //
      // @param [Resource]
      function subscribeToUpdates(model, destroyCallback) {
        if (!model.$name) return;

        // hardcoded event prefix, pluralize model name
        var eventName = 'update--' + model.$name + 's/' + model.id
        Stream.subscribe(eventName, model)

        // if no callback is present, no need to subscribe to destroy event
        if (!destroyCallback) return;

        // Destroy!!
        var eventName = 'destroy--' + model.$name + 's/' + model.id
        Stream.subscribe(eventName, model, destroyCallback);
      }

      // live callbacks for get for non-array responses
      // Call $live() on resource and run optional callback
      var singleWithLive = function(model, success, headers) {
        model.$live();

        if (isFunction(success))
          success(model, headers);
      }

      // live callbacks for collections
      // Loop through collection, call $live on each and
      // run optional callback
      var collectionWithLive = function(collection, success, headers) {
        forEach(collection, function(model) {
          model.$live(function() {
            removeMember(collection, model);
          });
        });

        if (isFunction(success))
          success(collection, headers);
      }

      // Decorate each resource with live listeners, accepts an extra
      // name argument, if name is present, use this when listening for
      // updates.
      var liveResourceFactory = function(url, paramDefaults, actions, name) {
        var Resource = $delegate(url, paramDefaults, actions);
        var actions = extend(DEFAULT_ACTIONS, actions || {});
        var original = {};

        // Add $live to each Resource
        Resource.prototype.$live = function(destroyCallback) {
          return subscribeToUpdates(this, destroyCallback);
        }

        // Add accessor for name, needed when subscribing to
        // events
        Resource.prototype.$name = name;

        /* Add live callback to each get or post action
         * these are the only actions that will return
         * new resources.
         *
         */
        forEach(actions, function(options, action) {
          if (!/^(POST|GET)$/i.test(options['method'])) return;
          var hasBody = /^(POST|PUT|PATCH)$/i.test(action['method']);

          // Adds an extra wrapper around the success callback,
          // arguments differs depending on type of request
          //
          // @return [Function]
          function substituteAction(a1, a2, a3, a4) {
            var result,
              requestData,
              error,
              params,
              success;

            // Call different callback depending on if dealing with
            // collection or single instance (get or post)
            var successCb = function(data, headers) {
              if (options['isArray']) {
                return collectionWithLive(data, success, headers);
              }
              singleWithLive(data, success, headers);
            }

            // GET/POST requests have different numbers of arguments,
            // POST puts data in a2, success in a3
            // GET puts success in a2 and doesn't pass a data obj
            //
            // return the a call to the original function, with
            // the modified success callback
            switch (arguments.length) {
              case 4:
                error = a4;
                success = a3;
              case 3:
              case 2:
                if (isFunction(a2)) {
                  if (isFunction(a1)) {
                    success = a1;
                    error = a2;
                    break;
                  }

                  success = a2;
                  error = a3;
                  //fallthrough
                } else {
                  params = a1;
                  requestData = a2;
                  success = a3;
                  break;
                }
              case 1:
                if (isFunction(a1)) success = a1;
                else if (hasBody) requestData = a1;
                else params = a1;
                break;
              case 0:
                break;
              default:
                throw $resourceMinErr('badargs',
                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                  arguments.length);
            }
            return original[action].call(this, params, requestData, successCb, error);
          }

          original[action] = Resource[action];
          Resource[action] = substituteAction;
        });

        return Resource;
      }

      return liveResourceFactory;
    }
  ]);
});
