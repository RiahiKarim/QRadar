'use strict';

/**
 * @ngdoc overview
 * @name qradarApp
 * @description
 * # qradarApp
 *
 * Main module of the application.
 */
angular
  .module('qradarApp', [
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap'

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/graphic.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
