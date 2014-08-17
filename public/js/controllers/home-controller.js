'use strict';

setgame.controller('HomeController', ['$scope', '$location', 'common', 'game', function ($scope, $location, common, game) {

    $scope.isPractice = common.isCurrentPath('/practice');
    $scope.start = game.start;

}]);
