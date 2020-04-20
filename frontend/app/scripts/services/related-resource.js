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
  'relatedResource',
  function(
    $resource,
    $q
  ) {
    function resourceWrapper(relations, url, defaultParams, methods, name) {
      var hasManyList = relations.hasMany || [],
        belongsToList = relations.belongsTo || [],
        allRelations = belongsToList.concat(hasManyList),
        extend = angular.extend,
        isFunction = angular.isFunction,
        forEach = angular.forEach;

      function circularSafeJson(data, headers) {
        var scrubbed = _.omit(data, allRelations);

        return angular.toJson(scrubbed);
      }

      extend(methods, {
        update: {
          method: 'PUT',
          transformRequest: circularSafeJson
        },
        save: {
          method: 'POST',
          transformRequest: circularSafeJson
        }
      });

      var Resource = $resource(url, defaultParams, methods, name);

      function persistChild(model) {
        var propagateAction = isFunction(model.$saveBelongsTo) ?
          '$saveWithHasMany' : '$update';

        return model.id ?
          model[propagateAction]() :
          model[propagateAction]();
      }

      function persistParent(parentResource) {
        var bubbleAction;

        angular.isFunction(parentResource.$saveBelongsTo) ?
          bubbleAction = '$saveBelongsTo' : '$save';

        return parentResource.id ?
          $q.when(parentResource) :
          parentResource[bubbleAction]();
      }

      // Persist all belongsToList and save respective IDs to model.
      // Return a promise that resolves once all belongsTo are saved
      function getPersistedBelongsTo(model) {
        var promises = new Array();

        forEach(belongsToList, function(eachBelongsTo) {
          var foreignId = eachBelongsTo + '_id';

          if (!model[eachBelongsTo] && !model[foreignId])
            throw new Error('missing relation: ' + eachBelongsTo);

          if (model[foreignId])
            return $q.when(model[foreignId]);

          var promise = persistParent(model[eachBelongsTo]).then(function(persistedParent) {
            model[foreignId] = persistedParent.id;
            return $q.when(model);
          });

          promises.push(promise);
        });

        return $q.all(promises)
      }


      // Persist all collections defined in
      // hasManyList, return a promise
      function persistResources(model) {
        var promises = new Array();

        forEach(hasManyList, function(hasMany) {
          forEach(model[hasMany], function(model) {
            var promise = model.getBelongsTo().then(function() {
              return persistChild(model);
            });
            promises.push(promise);
          });
        });

        return $q.all(promises);
      }

      Resource.prototype.getBelongsTo = function() {
        return getPersistedBelongsTo(this);
      }

      var oldUpdate = Resource.prototype.$update;

      Resource.prototype.$update = function(a1, a2, a3, a4) {
        var resource = this,
          relationCache = _.pick(resource, allRelations);

        return oldUpdate.call(resource, a1, a2, a3, a4).then(function() {
          return extend(resource, relationCache)
        });
      }

      function updateOrSave(resource) {
        return resource.id ? '$update' : '$save';
      }

      //Save when all belongsTo are saved
      Resource.prototype.$saveBelongsTo = function(a1, a2, a3, a4) {
        var resource = this,
          relationCache = _.pick(resource, allRelations),
          action = updateOrSave(resource);

        return getPersistedBelongsTo(resource).then(function() {
          return resource[action](a1, a2, a3, a4).then(function(savedResource) {
            return $q.when(extend(savedResource, relationCache));
          });
        });
      }

      // Save childrens after record has been are saved
      Resource.prototype.$saveWithHasMany = function(a1, a2, a3, a4) {
        var resource = this,
          action = updateOrSave(resource),
          relationCache = _.pick(resource, allRelations);

        return getPersistedBelongsTo(extend(resource, relationCache)).then(function() {
          return resource[action](a1, a2, a3, a4);
        }).then(function(savedResource) {
          return persistResources(extend(savedResource, relationCache));
        });
      }

      return Resource;
    }

    return resourceWrapper;
  });
