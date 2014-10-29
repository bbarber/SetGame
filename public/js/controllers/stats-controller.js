'use strict';

setgame.controller('StatsController', ['$scope', '$rootScope', 'common',
  function($scope, $rootScope, common) {
    $scope.minutes = parseInt($rootScope.score / 60, 10);
    $scope.seconds = parseInt($rootScope.score % 60, 10);
    $scope.playAgain = function() {

    };

    $scope.isPractice = common.isPractice();
  }
]);
