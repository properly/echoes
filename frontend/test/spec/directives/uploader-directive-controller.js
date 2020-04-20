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

describe('Controller: uploaderDirectiveCtrl', function() {

  // load the directive's module
  beforeEach(angular.mock.module('echoesApp'));

  var uploaderDirectiveCtrl,
    scope,
    $httpBackend,
    $rootScope,
    uploadSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_, Client) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    uploadSpy = jasmine.createSpy('upload').and.returnValue({
      progress: function() {
        return {
          success: angular.noop
        }
      }
    });
    scope.ngModel = {
      $saveBelongsTo: function() {
        return {
          then: function(cb) {
            cb();
          }
        }
      }
    }
    uploaderDirectiveCtrl = $controller('uploaderDirectiveCtrl', {
      $scope: scope,
      Upload: {
        upload: uploadSpy
      }
    });
  }));

  describe('onFileSelect', function() {
    beforeEach(function() {
      spyOn(scope.ngModel, '$saveBelongsTo').and.callThrough();
      scope.onFileSelect([{type:"image"}], {
        id: 1,
        $saveBelongsTo: jasmine.createSpy('update').and.returnValue({
          then: function(cb) {
            cb({
              id: 1
            });
          }
        })
      })
    });

    it('uploads a file', function() {
      expect(uploadSpy).toHaveBeenCalled();
    });

  });
});
