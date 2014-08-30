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
        }
      ]
    };
  }
]);
