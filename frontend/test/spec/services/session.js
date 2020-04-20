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

describe('Service: Session', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp', function($provide) {
    $provide.value('Uuid', {});
  }));

  // instantiate service
  var Session, $httpBackend, currentUser, Uuid;
  beforeEach(inject(function(_Session_, _$httpBackend_) {
    Session = _Session_;
    $httpBackend = _$httpBackend_;
  }));

  describe('currrentUser', function() {

    describe('when no currentUser', function() {
      beforeEach(function() {
        $httpBackend.when('GET', '/api/sessions/current').respond(null, 403);
        currentUser = Session.currentUser;
        $httpBackend.flush();
      });

      it('has no attributes', function() {
        expect(currentUser.id).toBe(undefined);
      });

    });

    describe('when currentUser is present', function() {

      beforeEach(function() {
        $httpBackend.when('GET', '/api/sessions/current').respond({
          id: 1,
          email: 'email'
        });
        currentUser = Session.currentUser;
        $httpBackend.flush();
      });

      it('attributes are accessible', function() {
        expect(currentUser.email).toBe('email');
      });

    });
  });

  describe('#update', function() {
    describe('when server responds with 403', function() {

      beforeEach(function() {
        $httpBackend.when('GET', '/api/sessions/current').respond(403, '');
        currentUser = Session.currentUser;
        $httpBackend.flush();
      });


      it('sets currentUser', function() {
        expect(currentUser).toEqual({});
      });

    });
    describe('when server responds with currentUser', function() {

      beforeEach(function() {
        $httpBackend.when('GET', '/api/sessions/current').respond({
          id: 1,
          email: 'email'
        });
        currentUser = Session.currentUser;
        $httpBackend.flush();
      });


      it('sets currentUser', function() {
        expect(currentUser.id).toEqual(1);
      });
    });

  });

  describe('#signIn', function() {
    describe('with valid credentials', function() {
      beforeEach(function() {
        $httpBackend.when('GET', '/api/sessions/current').respond(403);
        $httpBackend.when('POST', '/api/sessions').respond({
          id: 1,
          email: 'email'
        });
        Session.signIn();
        currentUser = Session.currentUser;
        $httpBackend.flush();
      });

      it('signs in', function() {
        expect(currentUser.id).toEqual(1);
      });
    });

    describe('with invalid credentials', function() {
      beforeEach(function() {
        $httpBackend.when('GET', '/api/sessions/current').respond(403);
        $httpBackend.when('POST', '/api/sessions').respond(401);
        Session.signIn();
        currentUser = Session.currentUser;
        $httpBackend.flush();
      });

      it('signs in', function() {
        expect(currentUser).toEqual({});
      });
    });

  });

  describe('#signOut', function() {
    beforeEach(function() {
      $httpBackend.when('GET', '/api/sessions/current').respond({
        id: 1,
        email: 'email'
      });
      $httpBackend.when('DELETE', '/api/sessions').respond();
      currentUser = Session.currentUser;
      Session.signOut();
      $httpBackend.flush();
    });

    it('signs out', function() {
      expect(currentUser).toEqual({});
    });
  });


});
