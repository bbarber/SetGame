'use strict';

setgame.directive('sgHeader', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/header.html',
        replace: true,
        controller: ['$scope', '$location', function ($scope, $location) {
            $scope.isCurrentPath = function (path) {
                return $location.path().toLowerCase() === path.toLowerCase();
            };
        }]
    };
});