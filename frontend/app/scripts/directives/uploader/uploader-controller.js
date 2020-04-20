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

angular.module('echoesApp').controller(
  'uploaderDirectiveCtrl',
  function($scope, Upload) {
    var uploader = $scope.file;

    // when a file is selected, either trigger $saveBelongsTo, or an update.
    // update progress on scope, copy json to model when done.
    $scope.onFileSelect = function(files, model) {
      var completed,
          saveAction = angular.isFunction($scope.ngModel['$saveBelongsTo']) ? '$saveBelongsTo' : '$update';

      var uploaded_file_type = undefined
      if (files[0] === undefined) { return }
      else { uploaded_file_type = files[0].type }

      model[saveAction]().then(function(model) {
        $scope.progress = 0.1;
        $scope.image = model[uploader];

        // name file as passed in uploader attribute (ex: uploader="avatar")
        var data = {};
        if (uploaded_file_type.match("image")) { data[uploader] = files[0]; }
        if (uploaded_file_type.match("video")) { data['video'] = files[0]; delete data[uploader]; }


        $scope.upload = Upload.upload({
          url: '/api/' + $scope.baseUrl + '/' + model.id,
          data: data,
          method: 'PUT',
        }).progress(function(evt) {
          // Firefox hits progress after success event
          if (!completed) { $scope.progress = ((evt.loaded / evt.total) * 100) };
        }).success(function(persistedContent) {
          $scope.progress = undefined;

          if (uploaded_file_type.match("video")) {
            persistedContent.image_processing = false;
          }

          completed = true;
          angular.extend($scope.ngModel, persistedContent);

        });
      });
    };

    // don't return an image url (since that caches a 404 in the browser)
    // unless processing has been completed
    $scope.imageUrl = function() {
      if (!$scope.$eval('ngModel[processingAttribute]'))
        return $scope.$eval('ngModel[file][imageSize].url');
    }

    // image url present and not currently
    // loading nor processing
    $scope.showPreview = function() {
      return (
        $scope.$eval('(ngModel.video.url || ngModel[file].url) && !(loading() || processing())') &&
        $scope.inlinePreview
      );
    }

    // loading and not processing
    $scope.loading = function() {
      return $scope.$eval('progress && !ngModel[processingAttribute]');
    }

    $scope.processing = function() {
      return $scope.$eval('!progress && ngModel[processingAttribute]');
    }
  }
);
