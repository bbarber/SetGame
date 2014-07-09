'use strict';

setgame.directive('sgHeader', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/header.html',
        controller: ['$scope', '$location', function($scope, $location) {
            
            $scope.$on('$locationChangeStart', function(event) {
                console.log(arguments);
            });
        }]
    };
});