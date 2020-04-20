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

describe('Service: flash', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var flash, sb, result;

  beforeEach(inject(function(_flash_) {
    flash = _flash_;

    sb = function() {
      result = 123;
    };
  }));

  describe('#subscribe to error', function() {

    beforeEach(function() {
      result = false;
      flash.subscribe(sb, 'error');
      flash.error = 'Error'
    });

    it('notify that message was set', function() {
      expect(result).toEqual(123);
    })
  })

  describe('#subscribe to success', function() {

    beforeEach(function() {
      result = false;
      flash.subscribe(sb, 'success');
      flash.error = 'Error';
    });

    it('notify that message was not set', function() {
      expect(result).not.toEqual(123);
    })
  })

  describe('#unsubscribe to error', function() {

    beforeEach(function() {
      result = false;
      flash.unsubscribe(0);
      flash.error = 'Error'
    });

    it('notify that message was not set', function() {
      expect(result).not.toEqual(123);
    })
  })

  describe('#clean', function() {

    beforeEach(function() {
      flash.error = 'Error';
      flash.clean();
    });

    it('notify that message was not set', function() {
      expect(flash.error).toEqual(null);
    })
  })

});
