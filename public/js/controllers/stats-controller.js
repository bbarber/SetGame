'use strict';

setgame.controller('StatsController', ['$scope', '$rootScope', 'common',
  function($scope, $rootScope, common) {

  
    $scope.score = $rootScope.score;
    $scope.isPractice = common.isPractice();
  }
]);
