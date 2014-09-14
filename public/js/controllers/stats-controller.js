'use strict';

setgame.controller('StatsController', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $scope.minutes = parseInt($rootScope.score / 60, 10);
    $scope.seconds = parseInt($rootScope.score % 60, 10);
  }
]);
