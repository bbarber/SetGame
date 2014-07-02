'use strict';


var setgame = angular.module('setgame', [
    'ngRoute',
    'ngResource'    
]);


setgame.config(['$routeProvider', '$locationProvider',
    function($routeProvider ,  $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'html/home.html',
            controller: 'HomeController'
        }) 
}]);