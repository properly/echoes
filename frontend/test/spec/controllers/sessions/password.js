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

describe('Controller: SessionsPasswordCtrl', function() {

  // load the controller's module
  beforeEach(angular.mock.module('echoesApp', function($provide) {
    $provide.value('Uuid', {});
  }));

  var SessionsPasswordCtrl,
    scope,
    $httpBackend,
    $location,
    currentUser,
    flash;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_, _flash_) {
    scope = $rootScope.$new();
    $location = _$location_;
    $httpBackend = _$httpBackend_;
    flash = _flash_;
    currentUser = {
      id: 1,
      email: 'em@ail.com'
    }

    $httpBackend.when('GET', '/api/sessions/current').respond(currentUser);

    $httpBackend.when('PUT', '/api/users/reset_password').respond({
      id: 2
    });

    $httpBackend.when('PUT', '/api/users/send_reset_password_instructions').respond({
      id: 2
    });

    $httpBackend.when('POST', '/api/sessions').respond({
      id: 2
    });

    SessionsPasswordCtrl = $controller('SessionsPasswordCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    $httpBackend.flush();
    expect(scope.user.id).toBe(1);
  });

  describe('#submit: com resetPassword', function() {
    beforeEach(function() {
      $location.search('resetPasswordToken', 'abc');
      scope.isResetPassword = true;

      scope.submit(scope.user);
      $httpBackend.flush();
    });

    it('sets new user id', function() {
      expect(scope.user.id).toEqual(2);
    });

    it('params to be reseted', function() {
      expect($location.search()["resetPasswordToken"]).toEqual(undefined);
    });
  });

  describe('#submit: com sendResetPasswordInstructions', function() {
    beforeEach(function() {
      $location.search('resetPasswordToken', 'abc');
      scope.submit(scope.user);
      $httpBackend.flush();
    });

    it('params not to be reseted', function() {
      expect($location.search()["resetPasswordToken"]).toEqual('abc');
    });
  });

});
