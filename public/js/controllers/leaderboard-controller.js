'use strict';

setgame.controller('LeaderboardController', ['$scope', 'GameApi',
  function($scope, GameApi, makePretty) {
    var offSetHours = new Date().getTimezoneOffset();
    var seed = parseInt((new Date().getTime() / (1000 * 60)  - offSetHours) / (60 * 24), 10);
    $scope.data = GameApi.getLeaderboard({time: seed});

    $scope.currentTab = 'today';
  }
]);
