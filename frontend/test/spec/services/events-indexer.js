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

describe('Service: eventsIndexer', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var eventsIndexer,
    eventsArray,
    eventsInstance;

  beforeEach(inject(function(_eventsIndexer_) {
    eventsIndexer = _eventsIndexer_;

    eventsArray = [{
      name: "post 1",
      scheduled_at: "2014-05-08T06:00:00.000Z"
    }, {
      name: "post 2",
      scheduled_at: "2014-05-08T06:06:00.000Z"
    }, {
      name: "post 3",
      scheduled_at: "2014-05-09T06:56:00.000Z"
    }]

    eventsInstance = new eventsIndexer({
      events: eventsArray,
      timestamp: 'scheduled_at'
    });
  }));

  it('splits to full hour key', function() {
    expect(eventsInstance.splitByHour()['2014-05-08T06:00:00.000Z'].length).toEqual(2);
  });

  it('maintains the same object in the output map', function() {
    var splitMap = eventsInstance.splitByHour()
    eventsArray[0].name = 'changed name'
    expect(splitMap['2014-05-08T06:00:00.000Z'][0]['name']).toEqual('changed name');
  });

  it('pushes new events into the output array', function() {
    var splitMap = eventsInstance.splitByHour()
    eventsArray.push({
      name: 'new post',
      scheduled_at: '2014-05-08T06:00:00.000Z'
    })

    expect(splitMap['2014-05-08T06:00:00.000Z'].length).toEqual(3);
  });

  it('when input is spliced it removes event in the output array', function() {
    var splitMap = eventsInstance.splitByHour()
    eventsArray.splice(1, 1);

    expect(splitMap['2014-05-08T06:00:00.000Z'].length).toEqual(1);
  });

  it('when input is spliced it removes event in the output array', function() {
    var splitMap = eventsInstance.splitByHour()
    eventsArray.splice(1, 1);

    expect(splitMap['2014-05-08T06:00:00.000Z'].length).toEqual(1);
  });

  it('when input is popped it removes event in the output array', function() {
    var splitMap = eventsInstance.splitByHour()
    eventsArray.pop();

    expect(splitMap['2014-05-09T06:00:00.000Z']).toEqual(undefined);
  });

  it('when no timestamps are given', function() {
    expect(function() {
      new eventsIndexer({
        events: []
      });
    }).toThrow(new Error('missing timestamp argument'));
  });

  it('when no events are given', function() {
    expect(function() {
      new eventsIndexer({
        timestamp: 'timestamp'
      });
    }).toThrow(new Error('missing events array in arguments'));
  });

  it('when no args are given', function() {
    expect(function() {
      new eventsIndexer();
    }).toThrow(new Error('eventIndexer needs to be instanciated with an object as argument'));
  });

  describe('#between', function() {
    it('returns events between given timestamps', function() {
      expect(Object.keys(eventsInstance.between('2014-05-09T06:00:00.000Z', '2014-05-09T07:00:00.000Z')).length).toEqual(1)
    });

    it('returns events between given timestamps', function() {
      expect(Object.keys(eventsInstance.between('2014-05-01T06:00:00.000Z', '2014-05-09T07:00:00.000Z')).length).toEqual(2)
    });

    it('when invalid', function() {
      expect(function() {
        eventsInstance.between('2014-05-01T06:00:00.000Z', '2014-45-01T06:00:00.000Z');
      }).toThrow(new Error('start or end date string is invalid'))
    });
  });

});
