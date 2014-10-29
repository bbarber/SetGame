'use strict';

setgame.controller('LeaderboardController', ['$scope', 'GameApi',
  function($scope, GameApi) {
    var seed = parseInt(new Date().getTime() / (1000 * 60 * 60 * 24), 10);
    $scope.data = GameApi.getLeaderboard({time: seed});

    $scope.currentTab = 'today';
  }
]);
