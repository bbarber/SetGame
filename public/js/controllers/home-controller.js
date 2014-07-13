'use strict';

setgame.controller('HomeController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.isFoRealz = $location.path().toLowerCase() !== '/practice';
    }
]);