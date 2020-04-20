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

angular.module('echoesApp')
  .filter('creditCard', function() {
    return function(ccnumber) {
      if (!ccnumber)
        return '';

      var cardType;
      ccnumber = ccnumber.toString().replace(/\s+/g, '');

      if (/^(34)|^(37)/.test(ccnumber)) {
        cardType = "amex";
      }
      if (/^(62)|^(88)/.test(ccnumber)) {
        cardType = "china-unionpay";
      }
      if (/^30[0-5]/.test(ccnumber)) {
        cardType = "diners-club-carte-blanche";
      }
      if (/^(2014)|^(2149)/.test(ccnumber)) {
        cardType = "diners-club-enroute";
      }
      if (/^36/.test(ccnumber)) {
        cardType = "diners-club-international";
      }
      if (/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)) {
        cardType = "discover-card";
      }
      if (/^35(2[89]|[3-8][0-9])/.test(ccnumber)) {
        cardType = "jcb";
      }
      if (/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
        cardType = "laser";
      }
      if (/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
        cardType = "maestro";
      }
      if (/^5[1-5]\d{14}/.test(ccnumber)) {
        cardType = "mastercard";
      }
      if (/^4.{15}/.test(ccnumber)) {
        cardType = "visa"
      }
      if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
        cardType = "visa-electron"
      }
      return cardType;
    };
  });
