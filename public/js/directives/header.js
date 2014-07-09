'use strict';

setgame.directive('sgHeader', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/header.html',
        controller: ['$scope', function($scope) {
            $scope.wut = 42;        
        }]
    };
});