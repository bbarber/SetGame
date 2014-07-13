'use strict';

setgame.directive('sgHeader', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/header.html',
        replace: true,
        controller: ['$scope', '$location', function($scope, $location) {

            // Select home on page load
            $scope.isHome = true;


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