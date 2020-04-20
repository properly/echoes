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

describe('Controller: revisionDirectiveCtrl', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var revisionDirectiveCtrl,
    scope,
    evt,
    $httpBackend,
    $rootScope,
    currentUser;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_, Client) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    currentUser = {
      id: 1,
      email: 'em@ail.com'
    };
    scope.revision = {
      $saveBelongsTo: function() {

      },
      contents: []
    };
    revisionDirectiveCtrl = $controller('revisionDirectiveCtrl', {
      $scope: scope
    });
  }));

  it('inits scope.targets', function() {
    expect(scope.targets.length).toEqual(4);
  });

  describe('addContent without post', function() {
    beforeEach(function() {
      scope.scheduledAt = moment().format('LL');

      scope.addContent();
    });

    it('does not save a revision', function() {
      expect(scope.revision.id).toEqual(undefined);
    })

    it('adds a content to array', function() {
      expect(scope.revision.contents.length).toEqual(1);
    })
  });

  describe('addContent with target', function() {
    beforeEach(function() {
      scope.addContent('facebook');
    });

    it('add target to content', function() {
      expect(_.last(scope.revision.contents).target).toEqual('facebook');
    });
  });

  describe('addContent: with content', function() {
    var revisionSpy;

    beforeEach(function() {
      scope.addContent({
        id: 1,
        $update: jasmine.createSpy('update')
      });
      revisionSpy = spyOn(scope.revision, '$saveBelongsTo').and.callThrough();

      scope.addContent();
    });

    it('does not save revision', function() {
      expect(revisionSpy).not.toHaveBeenCalled();
    });

    it('adds a content to array', function() {
      expect(scope.revision.contents.length).toEqual(2);
    })

  });

});
