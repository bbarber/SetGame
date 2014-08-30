'use strict';

setgame.directive('sgHeader', ['common',
  function(common) {
    return {
      restrict: 'E',
      templateUrl: 'html/directives/sg-header.html',
      replace: true,
      controller: ['$scope', '$location',
        function($scope, $location) {
          $scope.isCurrentPath = common.isCurrentPath;
        }
      ]
    };
  }
]);
