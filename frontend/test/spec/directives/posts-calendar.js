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

describe('Directive: postsCalendar', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var element,
    scope,
    $location;

  beforeEach(inject(function($rootScope, $httpBackend, $compile, _$location_) {
    $location = _$location_;
    $httpBackend.when('GET', 'views/shared/calendar/_calendar.html').respond('<p>this is the postsCalendar directive</p>');
    element = angular.element('<div posts-calendar ng-model="model" week="week"><div>');
    scope = $rootScope.$new();
    scope.week = moment("2014-02-03T03:00:00.000Z");
    $location.search('currentWeek', scope.week.unix());
    scope.model = [{
      id: '1',
      scheduled_at: '2014-01-29T03:00:00.000Z'
    }];
    element = $compile(element)(scope);
  }));

  it('getDate() return day of month as number', function() {
    expect(element.isolateScope().getDate(2)).toEqual('5');
  });

  it('getWeekday() returns the short name of weekday at passed index', function() {
    expect(element.isolateScope().getWeekday(2)).toEqual('qua');
  });

  it('today() sets week to current week', function() {
    element.isolateScope().today();
    scope.$apply();

    expect($location.search()['currentWeek']).toEqual(moment().unix());
  });

  it('prevWeek() increases currentWeek by 7 days', function() {
    element.isolateScope().prevWeek();
    scope.$apply();
    expect($location.search()['currentWeek']).toEqual(1390705200);
  });

  it('nextWeek() increases currentWeek by 7 days', function() {
    element.isolateScope().nextWeek();
    scope.$apply();
    expect($location.search()['currentWeek']).toEqual(1391914800);
  });

  it('splits posts into an array based on their date', function() {
    element.isolateScope().prevWeek();
    scope.$apply();
    element.isolateScope().nextWeek();
    scope.$apply();
    expect(element.isolateScope().postsForWeek[2][0].id).toEqual('1');
  });

  it('showPostPath for admin', function() {
    element.isolateScope().showPostPath(undefined, 1, 1, 1)
    expect($location.path()).toEqual('/clients/1/packages/1/posts/1');
  });

  it('showPostPath link for reviewer', function() {
    element.isolateScope().showPostPath(1, 1);
    expect($location.path()).toEqual('/reviews/1/posts/1');
  });
});
