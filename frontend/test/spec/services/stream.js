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

describe('Service: Stream', function() {

  // instantiate service
  let
    Stream,
    subscription,
    unsubSpy,
    addListenerSpy,
    resources = [],
    model,
    $rootScope,
    pusherCallback;

  // load the service's module
  beforeEach(angular.mock.module('echoesApp', function($provide) {
    unsubSpy = jasmine.createSpy('remove');
    addListenerSpy = jasmine.createSpy('addListenerSpy');

    $provide.value('CurrentUser', {
      organization_id: 1
    });


    $provide.value('ActionCable', {
      createConsumer : function() {
        return {
          subscriptions: {
            create: function(config, callbacks) {
              addListenerSpy(
                config.channel,
                callbacks
              );
              pusherCallback = callbacks.received;
            }
          }
        }
      }
    })
  }));

  beforeEach(inject(function(_Stream_, _$rootScope_, _ActionCable_) {
    Stream = _Stream_;
    $rootScope = _$rootScope_;
    model = {
      id: 2
    };
    subscription = Stream.subscribe('type', model);
    $rootScope.$apply();
  }));

  it('add eventListener', function() {
    expect(addListenerSpy).toHaveBeenCalledWith(
      'MessagesChannel',
      {received: jasmine.any(Function)}
    );
  });

  it('extends on new event', function() {
    pusherCallback({
      type: 'type',
      payload: {
        id: 1
      }
    });
    expect(model.id).toEqual(1);
  });

  describe('subscribeToNewResources()', function() {

    beforeEach(inject(function($resource) {
      resources = [];
      Stream.subscribeToNewResources(resources, {
        resourceService: $resource(),
        resourceName: 'comment',
        filterBy: 'revision_id',
        matchTo: 2
      });
      $rootScope.$apply();
    }));

    it('listens for new resources', function() {
      expect(addListenerSpy).toHaveBeenCalledWith(
        'MessagesChannel',
        {received: jasmine.any(Function)}
      );
    });

    it('adds to collection if matching', function() {
      pusherCallback({
        type: 'new--comment',
        payload: {
          revision_id: 2,
          id: 2
        }
      });
      expect(resources.length).toEqual(1);
    });

    it('does not add the same object twice', function() {
      pusherCallback({
        type: 'new--comment',
        payload: {
          revision_id: 2,
          id: 2
        }
      });
      pusherCallback({
        type: 'new--comment',
        payload: {
          revision_id: 2,
          id: 2
        }
      });
      expect(resources.length).toEqual(1);
    });
  });

});
