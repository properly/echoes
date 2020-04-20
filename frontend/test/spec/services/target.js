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

describe('Service: Target', function() {

  // load the service's module
  beforeEach(angular.mock.module('echoesApp'));

  // instantiate service
  var Target;

  beforeEach(inject(function(_Target_) {
    Target = _Target_;
  }));

  it('lists facebook', function() {
    expect(Target.names).toContain('facebook');
  })

  it('lists twitter', function() {
    expect(Target.names).toContain('twitter');
  })

  it('lists instagram', function() {
    expect(Target.names).toContain('instagram');
  })

  it('lists generic', function() {
    expect(Target.names).toContain('generic');
  })
});
