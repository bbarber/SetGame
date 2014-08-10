'use strict';

setgame.controller('HomeController', ['$scope', '$location', 'common', function ($scope, $location, common) {

    $scope.isPractice = common.isCurrentPath('/practice');
    $scope.start = start;

    function start(){
        common.isPractice = $scope.isPractice;
        console.log(common.isPractice);
    }

}]);
