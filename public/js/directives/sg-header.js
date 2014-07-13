'use strict';

setgame.directive('sgHeader', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/header.html',
        controller: ['$scope', '$location', function($scope, $location) {
            
            $scope.$on('$locationChangeStart', function () {
                var path = $location.path();
                
                $scope.isHome = false;
                $scope.isPractice = false;
                $scope.isStats = false;
                $scope.isLeaderboard = false;

                if(path === "/")
                    $scope.isHome = true;
                else if(path === "/practice")
                    $scope.isPractice = true;
                else if(path === "/stats")
                    $scope.isStats = true;
                else if(path === "/leaderboard")
                    $scope.isLeaderboard = true;
            });


        }]
    };
});