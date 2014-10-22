'use strict';

setgame.directive('sgHeader', ['common',
  function(common) {
    return {
      restrict: 'E',
      templateUrl: 'html/directives/sg-header.html',
      replace: true,
      controller: ['$scope',
        function($scope) {
          $scope.isCurrentPath = common.isCurrentPath;
          $scope.user = {
            Name: '_Branden',
            Id: 124124124124
          };

          $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
          };

        }
      ]
    };
  }
]);
