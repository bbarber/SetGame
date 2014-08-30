'use strict';

setgame.controller('StatsController', ['$scope', '$location',
  function($scope, $location) {

    $scope.score = 123;
    $scope.minutes = parseInt($scope.score / 60, 10);
    $scope.seconds = $scope.score % 60;
  }
]);
