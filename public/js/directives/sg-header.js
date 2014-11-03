'use strict';

setgame.directive('sgHeader', ['common', 'user', '$location', '$window',
  function(common, user, $location, $window) {
    return {
      restrict: 'E',
      templateUrl: 'html/directives/sg-header.html',
      replace: true,
      controller: ['$scope',
        function($scope) {
          $scope.isCurrentPath = common.isCurrentPath;
          $scope.isLoggedIn = user.isLoggedIn;
          $scope.user = localStorage['hero'];

          $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
          };

          $scope.logout = function() {
            localStorage.clear();
            $window.location.href = '/logout';
          };

        }
      ]
    };
  }
]);
