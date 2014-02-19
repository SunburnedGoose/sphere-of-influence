'use strict';

angular.module('sphereOfInfluenceApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/fng', {
        templateUrl: 'views/fng.html',
        controller: 'FngCtrl'
      })
      .when('/rookie-cop', {
        templateUrl: 'views/rookie-cop.html',
        controller: 'RookieCopCtrl'
      })
      .when('/cub', {
        templateUrl: 'views/cub.html',
        controller: 'CubCtrl'
      })
      .when('/cool-hand', {
        templateUrl: 'views/cool-hand.html',
        controller: 'CoolHandCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
