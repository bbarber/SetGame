'use strict';

var setgame = angular.module('setgame', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap'
]);

setgame.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
      templateUrl: 'html/home.html',
      controller: 'HomeController'
    })
      .when('/practice', {
        templateUrl: 'html/home.html',
        controller: 'HomeController'
      })
      .when('/stats', {
        templateUrl: 'html/stats.html',
        controller: 'StatsController'
      })
      .when('/leaderboard', {
        templateUrl: 'html/leaderboard.html',
        controller: 'LeaderboardController'
      })
      .otherwise({
        redirectTo: '/'
      });


    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }
]);
