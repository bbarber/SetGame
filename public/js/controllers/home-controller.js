'use strict';

setgame.controller('HomeController', ['$scope', 'common', 'engine', 'user', 'GameApi',
  function($scope, common, engine, user, GameApi) {

    $scope.isPractice = common.isPractice();
    $scope.seed = null;



    GameApi.getDailySeed(function(seed) {
      $scope.seed = seed;
    });


    // If practice, use current time to seed, otherwise use daily seed
    Math.seedrandom($scope.isPractice ? Date.now() : $scope.seed);


    $scope.start = function() {
      console.log('starting..');

      if ($scope.isPractice || user.isLoggedIn) {
        $scope.board = engine.createBoard();
        $scope.isStarted = true;
      } else {
        // If they want to play non-practice
        // they must be logged in first
        $scope.showLogins = true;
      }
    };



  }
]);
