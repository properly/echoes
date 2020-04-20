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

.directive('timepicker', function() {
  return {
    restrict: 'EA',
    scope: {
      scheduledTime: '=ngModel'
    },
    templateUrl: 'views/posts/_timepicker.html',
    link: function(scope, element, attrs) {
      var now = moment(),
          currentValue,
          input = element.find('input'),
          optionsWrapper = element.find(".time-options");

      // set current time to now + 1 hour
      input.val(moment().startOf('hour').add(1, 'hour').format('HH:mm'));

      // Events
      // show options when incomplete; select all when completed
      input.on('focus', function(e) {
        setCurrentValue();

        // show options
        if (currentValue.length < 5) {
          showOptions();
        }

        // If field is complete, select all
        if (currentValue.length >= 5) {
          input[0].setSelectionRange(0, currentValue.length);
        }
      });

      // Hide options if clicking outside the element
      $('body').on('click', function(e) {
        if ($.contains(element[0], e.target)) return;

        // close options
        hideOptions();
      });

      // Show/update options/ shide options when completed and valid
      input.on('keyup', function(e) {
        setCurrentValue();

        showOptions();
      });

      // Hide options when time is selected
      optionsWrapper.on('click', 'a', function() {
        selectTime($(this).html());
      });

      /* Setter for currentValue
       *
       */
      function setCurrentValue() {
        currentValue = input.val();
      }

      /* Open dropdown with time options according to entered value
       *
       */
      function showOptions() {
        var timeArray = currentValue.split(":"),
            hour = parseInt(timeArray[0], 10) || 0,
            minute = getMinute(timeArray[1]),
            options = [],
            link;

        scope.options = [];

        var m = moment({ hour: hour, minute: minute });

        if (!m.isValid()) {
          m = moment({ hour: 0, minute: 0 });
        }

        scope.options.push(m.format('HH:mm'));

        for (var i = 0; i < 9; i++) {
          scope.options.push(m.add(5, 'minutes').format('HH:mm'));
        }

        scope.$apply();

        // Show options
        optionsWrapper.show();
      }

      /* Hide options
       *
       */
      function hideOptions() {
        optionsWrapper.hide();
      }

      /* Parse minutes; if only one digit is entered, assumes it is the first
       * of two
       *
       * @param [String] value after : in the field
       * @return [Integer] minutes
       */
      function getMinute(val) {
        if (val && val.length < 2) {
          val += '0';
        }

        return parseInt(val, 10) || 0;
      }

      /* Assign value selected from dropdown.
       *
       * @param [String] Selected time. Format dd:dd
       */
      function selectTime(selectedTime) {
        scope.$apply(function() {
          scope.scheduledTime = selectedTime;
        });

        // close options
        hideOptions();
      }
    }
  }
});
