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

describe('decorate: $resource + live-resource', function() {

  // instantiate service
  var $resource,
    $httpBackend,
    response,
    Resource,
    subscriptionSpy;

  // load the service's module
  beforeEach(angular.mock.module('echoesApp', function($provide) {
    subscriptionSpy = jasmine.createSpy('subscriptionSpy');
    $provide.service('Stream', function() {
      return {
        subscribe: subscriptionSpy
      }
    })
  }));

  beforeEach(inject(function(_$resource_, _$httpBackend_) {
    $resource = _$resource_;
    $httpBackend = _$httpBackend_;
    response = {
      id: 1
    };

    $httpBackend.when('POST', '/api').respond(response);
    $httpBackend.when('GET', '/api/1').respond(response);
    $httpBackend.when('POST', '/api').respond(response);
    $httpBackend.when('PUT', '/api/1').respond(response);
    $httpBackend.when('GET', '/api').respond([{
      id: 1
    }, {
      id: 2
    }]);

    Resource = $resource('/api/:id', {
        id: '@id'
      }, {
        update: {
          method: 'PUT'
        },
        create: {
          method: 'POST'
        }
      },
      'post');
  }));

  it('Calls subscribe twice (update/destroy) for each resource', function() {
    Resource.query();
    $httpBackend.flush();
    expect(subscriptionSpy.calls.count()).toBe(4);
  });

  it('Calls subscribe with resource', function() {
    Resource.query();
    $httpBackend.flush();
    expect(subscriptionSpy.calls.mostRecent().args[1].id).toBe(2);
  });

  it('Calls subscribe with destroy', function() {
    Resource.get({id:1});
    $httpBackend.flush();
    expect(subscriptionSpy.calls.first().args[0]).toBe('update--posts/1');
  });

  it('calls subscribe with destroy on query()', function() {
    Resource.query();
    $httpBackend.flush();
    expect(subscriptionSpy.calls.mostRecent().args[0]).toBe('destroy--posts/2');
  });

  it('adds $name to new resource', function() {
    var r = new Resource
    expect(r.$name).toBe('post');
  });

  it('adds $name to queried resource', function() {
    var r = Resource.query();
    $httpBackend.flush();
    expect(r[0].$name).toBe('post');
  });

  it('adds live (update) to POST calls', function() {
    var r = new Resource
    expect(subscriptionSpy.calls.count()).toBe(0);
    r.$save();
    $httpBackend.flush();
    expect(subscriptionSpy.calls.count()).toBe(1);
  });

  it('does not add live on PUT calls', function() {
    var r = Resource.get({
      id: 1
    });
    $httpBackend.flush();
    var callCountBeforeUpdate = subscriptionSpy.calls.count();

    r.$update();
    $httpBackend.flush();

    expect(subscriptionSpy.calls.count()).toBe(callCountBeforeUpdate);
  });

  it('runs callback', function() {
    var spy = jasmine.createSpy('callback');
    var r = Resource.get({
      id: 1
    }, spy);
    $httpBackend.flush();
    expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
  });

});
