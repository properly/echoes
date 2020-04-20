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

"use strict";

/* base module for echoes, anything here will be
 * run in tests as well as in production
 */

const echoesApp = angular.module("echoesApp", [
  "echoes.settings",
  "errorCatcher",
  "ngCookies",
  "ngResource",
  "ngSanitize",
  "ngRoute",
  "pascalprecht.translate",
  "ui.bootstrap.modal",
  "template/modal/window.html",
  "template/modal/backdrop.html",
  "ui.bootstrap.tooltip",
  "template/tooltip/tooltip-popup.html",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.datepicker",
  "template/datepicker/datepicker.html",
  "template/datepicker/year.html",
  "template/datepicker/month.html",
  "template/datepicker/day.html",
  "angular-carousel",
  "ngFileUpload",
]);
echoesApp
  .config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl",
      })
      .when("/use_terms", {
        templateUrl: "views/use_terms.html",
      })
      .when("/login", {
        templateUrl: "views/sessions/new.html",
        controller: "SessionsNewCtrl",
        reloadOnSearch: false,
      })
      .when("/password", {
        templateUrl: "views/sessions/password.html",
        controller: "SessionsPasswordCtrl",
        reloadOnSearch: false,
      })
      .when("/clients", {
        templateUrl: "views/clients/index.html",
        controller: "ClientsIndexCtrl",
        reloadOnSearch: false,
      })
      .when("/clients/new", {
        templateUrl: "views/clients/new.html",
        controller: "ClientsNewCtrl",
      })
      .when("/clients/manage", {
        templateUrl: "views/clients/manage.html",
        controller: "ClientsManageCtrl",
      })
      .when("/clients/:clientId", {
        templateUrl: "views/calendar/show.html",
        controller: "ClientsShowCtrl",
        reloadOnSearch: false,
      })
      .when("/clients/:clientId/packages", {
        redirectTo: "/clients/:clientId", // While there's no actual view
        // for packages, redirect to client
      })
      .when("/clients/:clientId/packages/:packageId", {
        templateUrl: "views/calendar/show.html",
        controller: "PackagesShowCtrl",
        reloadOnSearch: false,
      })
      .when("/clients/:clientId/packages/:packageId/access-tokens/new", {
        templateUrl: "views/access-tokens/new.html",
        controller: "AccessTokensNewCtrl",
      })
      .when("/posts/new", {
        templateUrl: "views/posts/new.html",
        controller: "PostsNewCtrl",
      })
      .when("/clients/:clientId/posts/new", {
        templateUrl: "views/posts/new.html",
        controller: "PostsNewCtrl",
      })
      .when("/clients/:clientId/packages/:packageId/posts/new", {
        templateUrl: "views/posts/new.html",
        controller: "PostsNewCtrl",
      })
      .when("/clients/:clientId/packages/:packageId/posts/:postId", {
        templateUrl: "views/posts/show.html",
        controller: "PostsShowController",
      })
      .when("/clients/:clientId/packages/:packageId/posts/:postId/edit", {
        templateUrl: "views/posts/edit.html",
        controller: "PostsEditCtrl",
      })
      .when("/organizations/new", {
        templateUrl: "views/organizations/new.html",
        controller: "OrganizationsNewCtrl",
      })
      .when("/organizations/edit", {
        templateUrl: "views/organizations/edit.html",
        controller: "OrganizationsNewCtrl",
      })
      .when(
        "/clients/:clientId/packages/:packageId/posts/:postId/revisions/new",
        {
          templateUrl: "views/revisions/new.html",
          controller: "RevisionsNewCtrl",
        }
      )
      .when(
        "/clients/:clientId/packages/:packageId/posts/:postId/revisions/:revisionId/edit",
        {
          templateUrl: "views/revisions/edit.html",
          controller: "RevisionsEditCtrl",
        }
      )
      .when("/organizations/invitations", {
        templateUrl: "views/invitations/new.html",
        controller: "InvitationsNewCtrl",
      })
      .when("/organizations/invitations/accept", {
        templateUrl: "views/invitations/accept.html",
        controller: "InvitationsAcceptCtrl",
      })
      .when("/profile", {
        templateUrl: "views/profile/edit.html",
        controller: "ProfileCtrl",
      })
      /* Client routes */
      .when("/reviews", {
        templateUrl: "views/404.html",
      })
      .when("/reviews/:uuid", {
        redirectTo: "/reviews/:uuid/posts",
      })
      .when("/reviews/:uuid/posts", {
        templateUrl: "views/calendar/show.html",
        controller: "ReviewsPackageShowCtrl",
        reloadOnSearch: false,
      })
      .when("/reviews/:uuid/posts/:id", {
        templateUrl: "views/posts/show.html",
        controller: "ReviewsPostsShowCtrl",
      }) /* Admin routes */
      .when("/admin", {
        redirectTo: "/admin/users",
      })
      .when("/admin/users", {
        templateUrl: "views/admin/users/index.html",
        controller: "AdminUsersIndexCtrl",
        reloadOnSearch: false,
      }) /* Fallback route */
      .otherwise({
        redirectTo: "/",
      });
  })
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix("!");
  })
  .config(function($translateProvider) {
    "ngInject";
    $translateProvider.preferredLanguage("pt-BR");
    $translateProvider.useMissingTranslationHandlerLog(true);
    $translateProvider.useInterpolation("translateRailsInterpolation");
  })
  .config(function($tooltipProvider) {
    $tooltipProvider.options({
      appendToBody: true,
    });
  })
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      "self",
      // FIXME: Add url to uploads here
      "https:/[UPLOAD_HOST]/uploads/**",
    ]);
  })
  .config(function($httpProvider) {
    // FIXME: responseInterceptors are deprecated,
    // change logsOutUserOn401 to interceptors
    var logsOutUserOn401 = [
      "$q",
      "$rootScope",
      "$location",
      "CurrentUser",
      function($q, $rootScope, $location, CurrentUser) {
        var success = function(response) {
          return response;
        };

        var error = function(response) {
          if (response.status === 401) {
            //redirect them back to login page
            angular.copy({}, CurrentUser);
            $rootScope.$emit("sessionDestroyed");
            $location.path("/login");

            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        };

        return function(promise) {
          return promise.then(success, error);
        };
      },
    ],
      errorInterceptor = [
        "$q",
        "flash",
        "$filter",
        "$location",
        function($q, flash, $filter, $location) {
          return {
            request: function($config) {
              flash.error = flash.success = "";

              return $config;
            },
            responseError: function(rejection) {
              // 422: unprocessable entity (error messages), 401: unauthorized
              if (rejection.status == 422 || rejection.status == 401)
                flash.error = rejection.data;

              // 413: file too large for nginx, 404: not found, 500: internal server error
              if (
                rejection.status == 413 ||
                rejection.status == 404 ||
                rejection.status == 500
              )
                flash.error = $filter("t")("errors.messages.generic_error") ==
                  "errors.messages.generic_error"
                  ? "Ocorreu um erro!"
                  : $filter("t")("errors.messages.generic_error");

              // 403: forbidden
              if (rejection.status == 403)
                flash.error = $filter("t")("errors.messages.forbidden");

              return $q.reject(rejection);
            },
          };
        },
      ];

    $httpProvider.interceptors.push(errorInterceptor);
    $httpProvider.responseInterceptors.push(logsOutUserOn401);
  })
  .run(function($rootScope, $location, GoodGreeting, Uuid) {
    /* body class setup */
    $rootScope.$on("$routeChangeSuccess", function(event, currentRoute) {
      var currentBody = GoodGreeting.bodyClass(moment());

      switch (currentRoute.templateUrl) {
        case "views/sessions/new.html":
        case "views/invitations/accept.html":
        case "views/sessions/password.html":
          $rootScope.bodyClass = "login " + currentBody;
          break;

        case "views/main.html":
          $rootScope.bodyClass = "home " + currentBody;
          break;

        case "views/posts/show.html":
        case "views/calendar/show.html":
          $rootScope.bodyClass = "post " + currentBody;
          break;

        default:
          $rootScope.bodyClass = currentBody;
          break;
      }
    });
  });

/* break out things that dificults testing,
 * such as urlLoader for translations.
 * Load the main app as a dependency.
 */
const prod = angular
  .module("echoesAppProd", ["echoesApp"])
  .config(function($translateProvider) {
    $translateProvider.useUrlLoader("api/translations");
  });
